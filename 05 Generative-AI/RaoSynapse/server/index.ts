import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';
import path from 'node:path';
import { z, ZodError } from 'zod';
import {
  addMessage, audit, canRead, canWrite, conversationSummary, copyConversation, createConversation,
  db, getConversation, getUser, hashToken, id, listConversations, membership, newToken, now,
  publicUser, serializeMessage, type Conversation, type Message, type User,
} from './db.js';
import { createSession, csrfProtection, currentUser, logout, optionalAuth, requireAuth, userFromToken } from './auth.js';
import { realtime } from './realtime.js';
import { aiStatus, completeAI, streamAI, type AIInputMessage } from './ai.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || (isProduction ? 3000 : 3001));

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());
app.use(optionalAuth);
app.use(csrfProtection);

function validate<T>(schema: z.ZodType<T>, value: unknown): T {
  return schema.parse(value);
}

function safeUser(user: User) {
  return publicUser(user);
}

function requireConversation(req: Request, res: Response, types?: Conversation['type'][]) {
  const conversation = getConversation(String(req.params.id));
  if (!conversation || !canRead(conversation.id, req.user!.id) || (types && !types.includes(conversation.type))) {
    res.status(404).json({ error: 'Conversation not found or access denied.', code: 'NOT_FOUND' });
    return null;
  }
  return conversation;
}

function requireRoomOwner(req: Request, res: Response) {
  const conversation = requireConversation(req, res, ['room']);
  if (!conversation) return null;
  if (membership(conversation.id, req.user!.id)?.role !== 'owner') {
    res.status(403).json({ error: 'Only the room owner can perform this action.', code: 'PERMISSION_DENIED' });
    return null;
  }
  return conversation;
}

function blockedBetween(a: string, b: string) {
  return !!db.prepare('SELECT 1 FROM blocks WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)').get(a, b, b, a);
}

const buckets = new Map<string, { count: number; reset: number }>();
function rateLimit(name: string, maximum: number, windowMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identity = req.user?.id || req.ip || 'unknown';
    const key = `${name}:${identity}`;
    const current = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.reset <= current) {
      buckets.set(key, { count: 1, reset: current + windowMs });
      return next();
    }
    if (bucket.count >= maximum) {
      res.setHeader('Retry-After', Math.ceil((bucket.reset - current) / 1000));
      return res.status(429).json({ error: 'Too many requests. Please wait and try again.', code: 'RATE_LIMITED' });
    }
    bucket.count += 1;
    next();
  };
}

function broadcastMessage(message: Message) {
  const members = db.prepare('SELECT user_id FROM conversation_members WHERE conversation_id = ?').all(message.conversation_id) as any[];
  for (const member of members) {
    realtime.sendToUser(member.user_id, {
      type: 'message_created',
      conversationId: message.conversation_id,
      message: serializeMessage(message, member.user_id),
    });
  }
}

function broadcastMessageUpdate(message: Message) {
  const members = db.prepare('SELECT user_id FROM conversation_members WHERE conversation_id = ?').all(message.conversation_id) as any[];
  for (const member of members) {
    realtime.sendToUser(member.user_id, {
      type: 'message_updated', conversationId: message.conversation_id,
      message: serializeMessage(message, member.user_id),
    });
  }
}

function conversationDetail(conversation: Conversation, userId: string) {
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY sequence ASC').all(conversation.id) as Message[];
  return { ...conversationSummary(conversation, userId), messages: messages.map(m => serializeMessage(m, userId)) };
}

function withPresence(conversation: any) {
  return {
    ...conversation,
    members: (conversation.members || []).map((member: any) => ({
      ...member,
      online: member.showPresence ? realtime.isOnline(member.id) : null,
    })),
  };
}

// Public health and authentication
app.get('/api/v1/health', (_req, res) => {
  const database = db.prepare('SELECT 1 AS ok').get() as any;
  res.json({ status: database.ok === 1 ? 'ok' : 'degraded', service: 'raosynapse', time: now() });
});

const identitySchema = z.object({
  username: z.string().trim().regex(/^[a-zA-Z0-9_]{3,24}$/, 'Use 3–24 letters, numbers, or underscores.'),
  displayName: z.string().trim().max(60).optional(),
});

// Username-only preview identity. Server sessions and per-workspace authorization still apply.
app.post('/api/auth/enter', rateLimit('identity', 30, 15 * 60_000), (req, res) => {
  const input = validate(identitySchema, req.body);
  const username = input.username.toLowerCase();
  const existing = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username) as User | undefined;
  if (existing) {
    createSession(res, existing.id);
    return res.json({ user: safeUser(existing), isNew: false });
  }

  const displayName = input.displayName?.trim();
  if (!displayName) return res.status(400).json({ error: 'This is a new username. Add a display name to create its workspace.', code: 'DISPLAY_NAME_REQUIRED' });
  const userId = id();
  try {
    db.prepare(`INSERT INTO users (id, username, display_name, avatar_color, created_at)
      VALUES (?, ?, ?, ?, ?)`)
      .run(userId, username, displayName, ['#7C5CFF', '#35D0BA', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 4)], now());
  } catch (error: any) {
    if (String(error.message).includes('UNIQUE')) {
      const concurrent = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username) as User | undefined;
      if (concurrent) {
        createSession(res, concurrent.id);
        return res.json({ user: safeUser(concurrent), isNew: false });
      }
    }
    throw error;
  }
  createSession(res, userId);
  audit(userId, 'account.registered', userId, { method: 'username-only-preview' });
  res.status(201).json({ user: safeUser(getUser(userId)!), isNew: true });
});

app.post('/api/auth/logout', (req, res) => {
  logout(req, res);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: currentUser(req), ai: aiStatus() });
});

// Public developer API authentication
function bearerAuth(scope?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    if (!token) return res.status(401).json({ error: { code: 'unauthenticated', message: 'Bearer token required.' } });
    const record = db.prepare('SELECT * FROM api_tokens WHERE token_hash = ? AND revoked_at IS NULL').get(hashToken(token)) as any;
    if (!record) return res.status(401).json({ error: { code: 'unauthenticated', message: 'Invalid or revoked token.' } });
    const scopes = JSON.parse(record.scopes) as string[];
    if (scope && !scopes.includes(scope)) return res.status(403).json({ error: { code: 'insufficient_scope', message: `Required scope: ${scope}` } });
    const user = getUser(record.user_id);
    if (!user) return res.status(401).json({ error: { code: 'unauthenticated', message: 'Token owner unavailable.' } });
    req.apiUser = user;
    req.apiScopes = scopes;
    db.prepare('UPDATE api_tokens SET last_used_at = ? WHERE id = ?').run(now(), record.id);
    next();
  };
}

app.get('/api/v1/conversations', bearerAuth('messages:read'), (req, res) => {
  res.json({ data: listConversations(req.apiUser!.id) });
});

app.get('/api/v1/conversations/:id/messages', bearerAuth('messages:read'), (req, res) => {
  const conversation = getConversation(String(req.params.id));
  if (!conversation || !canRead(conversation.id, req.apiUser!.id)) return res.status(404).json({ error: { code: 'not_found', message: 'Conversation not found.' } });
  const after = Math.max(0, Number(req.query.after || 0));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 50)));
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? AND sequence > ? ORDER BY sequence LIMIT ?').all(conversation.id, after, limit) as Message[];
  res.json({ data: messages.map(m => serializeMessage(m, req.apiUser!.id)) });
});

app.post('/api/v1/messages', bearerAuth('messages:send'), rateLimit('api-message', 120, 60_000), (req, res) => {
  const input = validate(z.object({ conversationId: z.string(), content: z.string().min(1).max(8000), idempotencyKey: z.string().min(8).max(64) }), req.body);
  const conversation = getConversation(input.conversationId);
  if (!conversation || !['direct', 'room'].includes(conversation.type) || !canWrite(conversation.id, req.apiUser!.id)) {
    return res.status(404).json({ error: { code: 'not_found', message: 'Writable conversation not found.' } });
  }
  const message = addMessage(conversation.id, req.apiUser!.id, 'user', input.content, `api:${input.idempotencyKey}`);
  broadcastMessage(message);
  res.status(201).json({ data: serializeMessage(message, req.apiUser!.id) });
});

app.get('/api/v1/messages/:id', bearerAuth('messages:read'), (req, res) => {
  const message = db.prepare('SELECT * FROM messages WHERE id = ?').get(req.params.id) as Message | undefined;
  if (!message || !canRead(message.conversation_id, req.apiUser!.id)) return res.status(404).json({ error: { code: 'not_found', message: 'Message not found.' } });
  res.json({ data: serializeMessage(message, req.apiUser!.id) });
});

app.post('/api/v1/ai/chat', bearerAuth('ai:use'), rateLimit('api-ai', 30, 5 * 60_000), async (req, res) => {
  const input = validate(z.object({ conversationId: z.string(), content: z.string().min(1).max(12000), idempotencyKey: z.string().min(8).max(64) }), req.body);
  const conversation = getConversation(input.conversationId);
  if (!conversation || conversation.type !== 'ai' || !canWrite(conversation.id, req.apiUser!.id)) {
    return res.status(404).json({ error: { code: 'not_found', message: 'AI conversation not found.' } });
  }
  const result = db.transaction(() => {
    const userMessage = addMessage(conversation.id, req.apiUser!.id, 'user', input.content, `api:${input.idempotencyKey}`);
    const previousRun = db.prepare('SELECT * FROM ai_runs WHERE request_message_id = ? ORDER BY created_at DESC LIMIT 1').get(userMessage.id) as any;
    if (previousRun) return { userMessage, run: previousRun, reused: true };
    const responseMessage = addMessage(conversation.id, null, 'assistant', '', undefined, 'streaming', aiStatus().model);
    const runId = id();
    db.prepare(`INSERT INTO ai_runs (id, conversation_id, request_message_id, response_message_id, initiating_user_id, status, model, created_at)
      VALUES (?, ?, ?, ?, ?, 'streaming', ?, ?)`).run(runId, conversation.id, userMessage.id, responseMessage.id, req.apiUser!.id, aiStatus().model, now());
    return { userMessage, responseMessage, runId, reused: false };
  })();
  if (result.reused) {
    const responseMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.run.response_message_id) as Message;
    return res.json({ data: { message: serializeMessage(responseMessage, req.apiUser!.id), provider: aiStatus(), reused: true } });
  }
  try {
    const history = db.prepare("SELECT role, content FROM messages WHERE conversation_id = ? AND sequence <= ? AND content != '' ORDER BY sequence DESC LIMIT 20")
      .all(conversation.id, result.userMessage.sequence).reverse() as AIInputMessage[];
    const content = await completeAI(history);
    db.prepare("UPDATE messages SET content = ?, status = 'completed' WHERE id = ?").run(content, result.responseMessage!.id);
    db.prepare("UPDATE ai_runs SET status = 'completed', finished_at = ? WHERE id = ?").run(now(), result.runId);
    const responseMessage = db.prepare('SELECT * FROM messages WHERE id = ?').get(result.responseMessage!.id) as Message;
    broadcastMessage(result.userMessage);
    broadcastMessageUpdate(responseMessage);
    res.json({ data: { message: serializeMessage(responseMessage, req.apiUser!.id), provider: aiStatus() } });
  } catch (error: any) {
    db.prepare("UPDATE messages SET status = 'failed' WHERE id = ?").run(result.responseMessage!.id);
    db.prepare("UPDATE ai_runs SET status = 'failed', error = ?, finished_at = ? WHERE id = ?").run('Provider request failed', now(), result.runId);
    res.status(502).json({ error: { code: 'provider_unavailable', message: 'The AI provider could not complete this request.' } });
  }
});

// Everything below this line requires an authenticated browser session.
app.use('/api', requireAuth);

app.get('/api/dashboard', (req, res) => {
  const userId = req.user!.id;
  const conversations = listConversations(userId);
  const projects = db.prepare('SELECT COUNT(*) AS count FROM research_projects WHERE owner_id = ?').get(userId) as any;
  const invites = db.prepare('SELECT COUNT(*) AS count FROM invitations WHERE invited_user_id = ? AND status = ?').get(userId, 'pending') as any;
  res.json({
    stats: {
      ai: conversations.filter(c => c.type === 'ai').length,
      messages: conversations.filter(c => c.type === 'direct').reduce((sum, c) => sum + c.unread, 0),
      rooms: conversations.filter(c => c.type === 'room').length,
      research: Number(projects.count),
      invitations: Number(invites.count),
    },
    recent: conversations.slice(0, 5),
    ai: aiStatus(),
  });
});

app.patch('/api/users/me', (req, res) => {
  const input = validate(z.object({
    displayName: z.string().trim().min(1).max(60).optional(),
    bio: z.string().trim().max(280).optional(),
    discoverable: z.boolean().optional(),
    messagePrivacy: z.enum(['everyone', 'nobody']).optional(),
    showPresence: z.boolean().optional(),
  }), req.body);
  const current = req.user!;
  db.prepare(`UPDATE users SET display_name = ?, bio = ?, discoverable = ?, message_privacy = ?, show_presence = ? WHERE id = ?`)
    .run(input.displayName ?? current.display_name, input.bio ?? current.bio,
      input.discoverable === undefined ? current.discoverable : (input.discoverable ? 1 : 0),
      input.messagePrivacy ?? current.message_privacy,
      input.showPresence === undefined ? current.show_presence : (input.showPresence ? 1 : 0), current.id);
  audit(current.id, 'profile.updated', current.id);
  res.json({ user: safeUser(getUser(current.id)!) });
});

app.post('/api/users/me/sessions/revoke-others', (req, res) => {
  const result = db.prepare('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?').run(req.user!.id, hashToken(req.sessionToken || ''));
  res.json({ ok: true, revoked: result.changes });
});

app.delete('/api/users/me', (req, res) => {
  const userId = req.user!.id;
  audit(userId, 'account.deleted', userId);
  logout(req, res);
  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  res.json({ ok: true });
});

app.get('/api/users/search', (req, res) => {
  const query = String(req.query.q || '').trim();
  if (query.length < 2) return res.json({ users: [] });
  const users = db.prepare(`SELECT * FROM users WHERE discoverable = 1 AND id != ? AND username LIKE ? COLLATE NOCASE ORDER BY username LIMIT 12`)
    .all(req.user!.id, `%${query}%`) as User[];
  res.json({ users: users.map(u => ({ ...safeUser(u), online: u.show_presence ? realtime.isOnline(u.id) : null })) });
});

app.post('/api/users/:id/block', (req, res) => {
  if (req.params.id === req.user!.id || !getUser(req.params.id)) return res.status(400).json({ error: 'Invalid user.' });
  db.prepare('INSERT OR IGNORE INTO blocks (blocker_id, blocked_id, created_at) VALUES (?, ?, ?)').run(req.user!.id, req.params.id, now());
  audit(req.user!.id, 'user.blocked', req.params.id);
  res.json({ ok: true });
});

app.delete('/api/users/:id/block', (req, res) => {
  db.prepare('DELETE FROM blocks WHERE blocker_id = ? AND blocked_id = ?').run(req.user!.id, req.params.id);
  res.json({ ok: true });
});

app.post('/api/users/:id/report', (req, res) => {
  const input = validate(z.object({ reason: z.string().trim().min(5).max(1000) }), req.body);
  if (!getUser(req.params.id)) return res.status(404).json({ error: 'User not found.' });
  db.prepare('INSERT INTO reports (id, reporter_id, reported_user_id, reason, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(id(), req.user!.id, req.params.id, input.reason, now());
  res.status(201).json({ ok: true, message: 'Report recorded for review.' });
});

app.get('/api/conversations', (req, res) => {
  const conversations = listConversations(req.user!.id, String(req.query.type || '') || undefined, String(req.query.query || ''));
  res.json({ conversations: conversations.map(withPresence) });
});

app.post('/api/conversations', (req, res) => {
  const input = validate(z.object({ type: z.enum(['ai', 'room']), title: z.string().trim().min(1).max(120).optional() }), req.body);
  const title = input.title || (input.type === 'ai' ? 'New intelligence thread' : 'New collaborative room');
  const conversation = createConversation(input.type, title, req.user!.id);
  audit(req.user!.id, 'conversation.created', conversation.id, { type: input.type });
  res.status(201).json({ conversation: conversationSummary(conversation, req.user!.id) });
});

app.post('/api/conversations/direct', (req, res) => {
  const input = validate(z.object({ userId: z.string() }), req.body);
  const other = getUser(input.userId);
  if (!other || other.id === req.user!.id) return res.status(404).json({ error: 'User not found.' });
  if (other.message_privacy === 'nobody' || blockedBetween(req.user!.id, other.id)) return res.status(403).json({ error: 'This member is not accepting messages.' });
  const existing = db.prepare(`SELECT c.* FROM conversations c
    JOIN conversation_members a ON a.conversation_id = c.id AND a.user_id = ?
    JOIN conversation_members b ON b.conversation_id = c.id AND b.user_id = ?
    WHERE c.type = 'direct' LIMIT 1`).get(req.user!.id, other.id) as Conversation | undefined;
  if (existing) return res.json({ conversation: withPresence(conversationSummary(existing, req.user!.id)) });
  const conversation = db.transaction(() => {
    const created = createConversation('direct', `${req.user!.display_name} & ${other.display_name}`, req.user!.id);
    db.prepare("UPDATE conversation_members SET role = 'member' WHERE conversation_id = ? AND user_id = ?").run(created.id, req.user!.id);
    db.prepare("INSERT INTO conversation_members (conversation_id, user_id, role, joined_at) VALUES (?, ?, 'member', ?)").run(created.id, other.id, now());
    return created;
  })();
  realtime.sendToUser(other.id, { type: 'conversation_added', conversation: conversationSummary(conversation, other.id) });
  res.status(201).json({ conversation: withPresence(conversationSummary(conversation, req.user!.id)) });
});

app.get('/api/conversations/:id', (req, res) => {
  const conversation = requireConversation(req, res);
  if (!conversation) return;
  res.json({ conversation: withPresence(conversationDetail(conversation, req.user!.id)) });
});

app.patch('/api/conversations/:id', (req, res) => {
  const conversation = requireConversation(req, res);
  if (!conversation) return;
  const role = membership(conversation.id, req.user!.id)?.role;
  if (role !== 'owner') return res.status(403).json({ error: 'Only the owner can change conversation settings.' });
  const input = validate(z.object({ title: z.string().trim().min(1).max(120).optional(), archived: z.boolean().optional() }), req.body);
  db.prepare('UPDATE conversations SET title = ?, archived_at = ?, updated_at = ? WHERE id = ?')
    .run(input.title ?? conversation.title, input.archived === undefined ? conversation.archived_at : (input.archived ? now() : null), now(), conversation.id);
  const updated = getConversation(conversation.id)!;
  realtime.broadcastConversation(conversation.id, { type: 'conversation_updated', conversationId: conversation.id, title: updated.title, archived: !!updated.archived_at });
  res.json({ conversation: conversationSummary(updated, req.user!.id) });
});

app.delete('/api/conversations/:id', (req, res) => {
  const conversation = requireConversation(req, res);
  if (!conversation) return;
  if (conversation.owner_id !== req.user!.id) return res.status(403).json({ error: 'Only the owner can delete this conversation.' });
  realtime.broadcastConversation(conversation.id, { type: 'conversation_deleted', conversationId: conversation.id });
  db.prepare('DELETE FROM conversations WHERE id = ?').run(conversation.id);
  audit(req.user!.id, 'conversation.deleted', conversation.id);
  res.json({ ok: true });
});

app.post('/api/conversations/:id/messages', rateLimit('message', 120, 60_000), (req, res) => {
  const conversation = requireConversation(req, res, ['direct', 'room']);
  if (!conversation) return;
  if (!canWrite(conversation.id, req.user!.id)) return res.status(403).json({ error: 'Viewers cannot send messages.' });
  if (conversation.type === 'direct') {
    const other = db.prepare('SELECT user_id FROM conversation_members WHERE conversation_id = ? AND user_id != ?').get(conversation.id, req.user!.id) as any;
    if (other && blockedBetween(req.user!.id, other.user_id)) return res.status(403).json({ error: 'Messaging is unavailable in this conversation.' });
  }
  const input = validate(z.object({ content: z.string().trim().min(1).max(8000), clientId: z.string().min(8).max(64) }), req.body);
  const message = addMessage(conversation.id, req.user!.id, 'user', input.content, input.clientId);
  broadcastMessage(message);
  res.status(201).json({ message: serializeMessage(message, req.user!.id) });
});

app.post('/api/conversations/:id/read', (req, res) => {
  const conversation = requireConversation(req, res);
  if (!conversation) return;
  const input = validate(z.object({ sequence: z.number().int().min(0) }), req.body);
  const sequence = Math.min(input.sequence, conversation.next_sequence);
  db.prepare('UPDATE conversation_members SET last_read_sequence = MAX(last_read_sequence, ?), last_delivered_sequence = MAX(last_delivered_sequence, ?) WHERE conversation_id = ? AND user_id = ?')
    .run(sequence, sequence, conversation.id, req.user!.id);
  realtime.broadcastConversation(conversation.id, { type: 'receipt_updated', conversationId: conversation.id, userId: req.user!.id, readSequence: sequence, deliveredSequence: sequence });
  res.json({ ok: true });
});

app.post('/api/conversations/:id/ai', rateLimit('ai', 40, 5 * 60_000), async (req, res) => {
  const conversation = requireConversation(req, res, ['ai', 'room']);
  if (!conversation) return;
  if (!canWrite(conversation.id, req.user!.id)) return res.status(403).json({ error: 'You do not have permission to request AI here.' });
  const active = db.prepare("SELECT id FROM ai_runs WHERE conversation_id = ? AND status = 'streaming'").get(conversation.id);
  if (active) return res.status(409).json({ error: 'An AI response is already in progress in this conversation.', code: 'AI_RUN_ACTIVE' });
  const input = validate(z.object({ content: z.string().trim().min(1).max(12000), clientId: z.string().min(8).max(64) }), req.body);

  const created = db.transaction(() => {
    const userMessage = addMessage(conversation.id, req.user!.id, 'user', input.content, input.clientId);
    const existingRun = db.prepare('SELECT * FROM ai_runs WHERE request_message_id = ? ORDER BY created_at DESC LIMIT 1').get(userMessage.id) as any;
    if (existingRun) return { userMessage, existingRun };
    const responseMessage = addMessage(conversation.id, null, 'assistant', '', undefined, 'streaming', aiStatus().model);
    const runId = id();
    db.prepare(`INSERT INTO ai_runs (id, conversation_id, request_message_id, response_message_id, initiating_user_id, status, model, created_at)
      VALUES (?, ?, ?, ?, ?, 'streaming', ?, ?)`)
      .run(runId, conversation.id, userMessage.id, responseMessage.id, req.user!.id, aiStatus().model, now());
    return { userMessage, responseMessage, runId };
  })();
  if ('existingRun' in created && created.existingRun) {
    return res.status(409).json({ error: 'This AI request has already been submitted.', code: 'AI_RUN_EXISTS' });
  }
  const userMessage = created.userMessage;
  const responseMessage = created.responseMessage!;
  const runId = created.runId!;
  broadcastMessage(userMessage);
  broadcastMessage(responseMessage);

  const history = db.prepare("SELECT role, content FROM messages WHERE conversation_id = ? AND sequence <= ? AND content != '' AND status != 'failed' ORDER BY sequence DESC LIMIT 20")
    .all(conversation.id, userMessage.sequence).reverse() as AIInputMessage[];

  res.status(200);
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  const write = (event: unknown) => { if (!res.destroyed && !res.writableEnded) res.write(`${JSON.stringify(event)}\n`); };
  write({ type: 'start', userMessage: serializeMessage(userMessage, req.user!.id), assistantMessage: serializeMessage(responseMessage, req.user!.id) });

  const controller = new AbortController();
  let finalized = false;
  res.on('close', () => { if (!finalized) controller.abort(); });
  let content = '';
  let finalStatus: Message['status'] = 'completed';
  let errorMessage: string | null = null;
  try {
    for await (const delta of streamAI(history, controller.signal)) {
      if (controller.signal.aborted) break;
      content += delta;
      write({ type: 'delta', messageId: responseMessage.id, content: delta });
    }
    if (controller.signal.aborted) {
      finalStatus = content ? 'partial' : 'failed';
      errorMessage = 'Generation stopped before completion.';
    }
  } catch (error: any) {
    finalStatus = content ? 'partial' : 'failed';
    errorMessage = controller.signal.aborted ? 'Generation stopped before completion.' :
      error.status === 429 ? 'The AI provider is rate limited. Please wait before retrying.' : 'The AI provider could not complete this response.';
  }

  db.prepare('UPDATE messages SET content = ?, status = ? WHERE id = ?').run(content, finalStatus, responseMessage.id);
  db.prepare('UPDATE ai_runs SET status = ?, error = ?, finished_at = ? WHERE id = ?')
    .run(finalStatus, errorMessage, now(), runId);
  const completed = db.prepare('SELECT * FROM messages WHERE id = ?').get(responseMessage.id) as Message;
  finalized = true;
  write({ type: 'done', message: serializeMessage(completed, req.user!.id), error: errorMessage });
  res.end();
  broadcastMessageUpdate(completed);
});

app.post('/api/conversations/:id/fork', (req, res) => {
  const conversation = requireConversation(req, res, ['ai', 'room', 'snapshot']);
  if (!conversation) return;
  const role = membership(conversation.id, req.user!.id)?.role;
  if (conversation.type === 'room' && !['owner', 'editor'].includes(role)) return res.status(403).json({ error: 'Viewers cannot fork this room.' });
  const input = validate(z.object({ title: z.string().trim().min(1).max(120).optional() }), req.body);
  const copy = copyConversation(conversation.id, 'ai', input.title || `${conversation.title} — fork`, req.user!.id);
  audit(req.user!.id, 'conversation.forked', conversation.id, { destination: copy.id });
  res.status(201).json({ conversation: conversationSummary(copy, req.user!.id) });
});

app.post('/api/conversations/:id/snapshots', (req, res) => {
  const conversation = requireConversation(req, res, ['ai', 'room']);
  if (!conversation) return;
  const role = membership(conversation.id, req.user!.id)?.role;
  if (!['owner', 'editor'].includes(role)) return res.status(403).json({ error: 'You do not have permission to share this conversation.' });
  const input = validate(z.object({ permission: z.enum(['view', 'fork']).default('view') }), req.body || {});
  const snapshot = copyConversation(conversation.id, 'snapshot', `${conversation.title} — snapshot`, req.user!.id);
  const token = newToken();
  const shareId = id();
  db.prepare('INSERT INTO share_links (id, snapshot_id, token_hash, permission, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(shareId, snapshot.id, hashToken(token), input.permission, req.user!.id, now());
  audit(req.user!.id, 'share.created', shareId, { source: conversation.id, permission: input.permission });
  res.status(201).json({ share: { id: shareId, snapshotId: snapshot.id, token, url: `/shared/${token}`, permission: input.permission, createdAt: now() } });
});

app.get('/api/shares', (req, res) => {
  const shares = db.prepare(`SELECT s.*, c.title FROM share_links s JOIN conversations c ON c.id = s.snapshot_id WHERE s.created_by = ? ORDER BY s.created_at DESC`).all(req.user!.id) as any[];
  res.json({ shares: shares.map(s => ({ id: s.id, snapshotId: s.snapshot_id, title: s.title, permission: s.permission, expiresAt: s.expires_at, revokedAt: s.revoked_at, createdAt: s.created_at })) });
});

app.delete('/api/shares/:id', (req, res) => {
  const share = db.prepare('SELECT * FROM share_links WHERE id = ? AND created_by = ?').get(req.params.id, req.user!.id) as any;
  if (!share) return res.status(404).json({ error: 'Share link not found.' });
  db.prepare('UPDATE share_links SET revoked_at = ? WHERE id = ?').run(now(), share.id);
  audit(req.user!.id, 'share.revoked', share.id);
  res.json({ ok: true });
});

function validShare(token: string) {
  const share = db.prepare('SELECT * FROM share_links WHERE token_hash = ?').get(hashToken(token)) as any;
  if (!share || share.revoked_at || (share.expires_at && new Date(share.expires_at).getTime() < Date.now())) return null;
  return share;
}

app.get('/api/shared/:token', (req, res) => {
  const share = validShare(req.params.token);
  if (!share) return res.status(404).json({ error: 'This share link is invalid, expired, or revoked.' });
  const snapshot = getConversation(share.snapshot_id)!;
  const messages = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY sequence').all(snapshot.id) as Message[];
  res.json({ shared: { id: snapshot.id, title: snapshot.title, permission: share.permission, createdAt: snapshot.created_at, messages: messages.map(m => serializeMessage(m)) } });
});

app.post('/api/shared/:token/fork', (req, res) => {
  const share = validShare(req.params.token);
  if (!share || share.permission !== 'fork') return res.status(403).json({ error: 'This link does not permit forking.' });
  const copy = copyConversation(share.snapshot_id, 'ai', `${getConversation(share.snapshot_id)!.title} — fork`, req.user!.id);
  res.status(201).json({ conversation: conversationSummary(copy, req.user!.id) });
});

app.get('/api/invitations', (req, res) => {
  const invitations = db.prepare(`SELECT i.*, c.title AS room_title, u.display_name AS inviter_name
    FROM invitations i JOIN conversations c ON c.id = i.room_id JOIN users u ON u.id = i.invited_by
    WHERE i.invited_user_id = ? AND i.status = 'pending' ORDER BY i.created_at DESC`).all(req.user!.id) as any[];
  res.json({ invitations: invitations.map(i => ({ id: i.id, roomId: i.room_id, roomTitle: i.room_title, inviterName: i.inviter_name, createdAt: i.created_at })) });
});

app.post('/api/conversations/:id/invitations', (req, res) => {
  const room = requireRoomOwner(req, res);
  if (!room) return;
  const input = validate(z.object({ username: z.string().trim().min(3).max(24) }), req.body);
  const invited = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(input.username) as User | undefined;
  if (!invited || invited.id === req.user!.id) return res.status(404).json({ error: 'User not found.' });
  if (membership(room.id, invited.id)) return res.status(409).json({ error: 'This user is already a room member.' });
  if (blockedBetween(req.user!.id, invited.id)) return res.status(403).json({ error: 'Invitation unavailable.' });
  const existing = db.prepare("SELECT * FROM invitations WHERE room_id = ? AND invited_user_id = ? AND status = 'pending'").get(room.id, invited.id);
  if (existing) return res.status(409).json({ error: 'An invitation is already pending.' });
  const inviteId = id();
  db.prepare('INSERT INTO invitations (id, room_id, invited_by, invited_user_id, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(inviteId, room.id, req.user!.id, invited.id, now());
  realtime.sendToUser(invited.id, { type: 'invitation_created', invitation: { id: inviteId, roomId: room.id, roomTitle: room.title, inviterName: req.user!.display_name } });
  res.status(201).json({ invitation: { id: inviteId, roomId: room.id, invitedUser: safeUser(invited) } });
});

app.post('/api/invitations/:id/:action', (req, res) => {
  const action = validate(z.enum(['accept', 'decline']), req.params.action);
  const invitation = db.prepare("SELECT * FROM invitations WHERE id = ? AND invited_user_id = ? AND status = 'pending'").get(req.params.id, req.user!.id) as any;
  if (!invitation) return res.status(404).json({ error: 'Invitation not found.' });
  if (action === 'decline') {
    db.prepare("UPDATE invitations SET status = 'declined', responded_at = ? WHERE id = ?").run(now(), invitation.id);
    return res.json({ ok: true });
  }
  db.transaction(() => {
    db.prepare("UPDATE invitations SET status = 'accepted', responded_at = ? WHERE id = ?").run(now(), invitation.id);
    db.prepare("INSERT OR IGNORE INTO conversation_members (conversation_id, user_id, role, joined_at) VALUES (?, ?, 'editor', ?)").run(invitation.room_id, req.user!.id, now());
  })();
  const room = getConversation(invitation.room_id)!;
  realtime.broadcastConversation(room.id, { type: 'member_added', conversationId: room.id, member: { ...safeUser(req.user!), role: 'editor' } });
  realtime.sendToUser(req.user!.id, { type: 'conversation_added', conversation: conversationSummary(room, req.user!.id) });
  res.json({ conversation: conversationSummary(room, req.user!.id) });
});

app.patch('/api/conversations/:id/members/:userId', (req, res) => {
  const room = requireRoomOwner(req, res);
  if (!room) return;
  const input = validate(z.object({ role: z.enum(['editor', 'viewer']) }), req.body);
  if (req.params.userId === room.owner_id) return res.status(400).json({ error: 'Transfer ownership instead of changing the owner role.' });
  const result = db.prepare('UPDATE conversation_members SET role = ? WHERE conversation_id = ? AND user_id = ?').run(input.role, room.id, req.params.userId);
  if (!result.changes) return res.status(404).json({ error: 'Member not found.' });
  realtime.broadcastConversation(room.id, { type: 'member_updated', conversationId: room.id, userId: req.params.userId, role: input.role });
  res.json({ ok: true });
});

app.delete('/api/conversations/:id/members/:userId', (req, res) => {
  const room = requireRoomOwner(req, res);
  if (!room) return;
  if (req.params.userId === room.owner_id) return res.status(400).json({ error: 'The owner cannot be removed.' });
  db.prepare('DELETE FROM conversation_members WHERE conversation_id = ? AND user_id = ?').run(room.id, req.params.userId);
  realtime.sendToUser(req.params.userId, { type: 'conversation_deleted', conversationId: room.id });
  realtime.broadcastConversation(room.id, { type: 'member_removed', conversationId: room.id, userId: req.params.userId });
  res.json({ ok: true });
});

app.get('/api/research/projects', (req, res) => {
  const projects = db.prepare(`SELECT p.*, COUNT(s.id) AS source_count FROM research_projects p
    LEFT JOIN research_sources s ON s.project_id = p.id WHERE p.owner_id = ? GROUP BY p.id ORDER BY p.updated_at DESC`).all(req.user!.id) as any[];
  res.json({ projects: projects.map(p => ({ id: p.id, title: p.title, description: p.description, conversationId: p.conversation_id, sourceCount: p.source_count, createdAt: p.created_at, updatedAt: p.updated_at })) });
});

app.post('/api/research/projects', (req, res) => {
  const input = validate(z.object({ title: z.string().trim().min(1).max(120), description: z.string().trim().max(1000).default('') }), req.body);
  const projectId = id();
  db.prepare('INSERT INTO research_projects (id, owner_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(projectId, req.user!.id, input.title, input.description, now(), now());
  res.status(201).json({ project: { id: projectId, title: input.title, description: input.description, sourceCount: 0, createdAt: now(), updatedAt: now() } });
});

app.get('/api/research/projects/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM research_projects WHERE id = ? AND owner_id = ?').get(req.params.id, req.user!.id) as any;
  if (!project) return res.status(404).json({ error: 'Research project not found.' });
  const sources = db.prepare('SELECT * FROM research_sources WHERE project_id = ? ORDER BY created_at DESC').all(project.id) as any[];
  res.json({ project: { id: project.id, title: project.title, description: project.description, conversationId: project.conversation_id, createdAt: project.created_at, updatedAt: project.updated_at,
    sources: sources.map(s => ({ id: s.id, url: s.url, title: s.title, author: s.author, publisher: s.publisher, publicationDate: s.publication_date, accessedAt: s.accessed_at, notes: s.notes, createdAt: s.created_at })) } });
});

app.patch('/api/research/projects/:id', (req, res) => {
  const project = db.prepare('SELECT * FROM research_projects WHERE id = ? AND owner_id = ?').get(req.params.id, req.user!.id) as any;
  if (!project) return res.status(404).json({ error: 'Research project not found.' });
  const input = validate(z.object({ title: z.string().trim().min(1).max(120).optional(), description: z.string().trim().max(1000).optional() }), req.body);
  db.prepare('UPDATE research_projects SET title = ?, description = ?, updated_at = ? WHERE id = ?')
    .run(input.title ?? project.title, input.description ?? project.description, now(), project.id);
  res.json({ ok: true });
});

app.delete('/api/research/projects/:id', (req, res) => {
  const result = db.prepare('DELETE FROM research_projects WHERE id = ? AND owner_id = ?').run(req.params.id, req.user!.id);
  if (!result.changes) return res.status(404).json({ error: 'Research project not found.' });
  res.json({ ok: true });
});

app.post('/api/research/projects/:id/sources', (req, res) => {
  const project = db.prepare('SELECT * FROM research_projects WHERE id = ? AND owner_id = ?').get(req.params.id, req.user!.id) as any;
  if (!project) return res.status(404).json({ error: 'Research project not found.' });
  const input = validate(z.object({
    url: z.string().url().max(2048), title: z.string().trim().min(1).max(240),
    author: z.string().trim().max(160).default(''), publisher: z.string().trim().max(160).default(''),
    publicationDate: z.string().trim().max(30).default(''), notes: z.string().trim().max(5000).default(''),
  }), req.body);
  const parsed = new URL(input.url);
  if (!['http:', 'https:'].includes(parsed.protocol)) return res.status(400).json({ error: 'Only HTTP and HTTPS sources are supported.' });
  const sourceId = id();
  db.prepare(`INSERT INTO research_sources (id, project_id, url, title, author, publisher, publication_date, accessed_at, notes, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(sourceId, project.id, input.url, input.title, input.author, input.publisher, input.publicationDate, now().slice(0, 10), input.notes, req.user!.id, now());
  db.prepare('UPDATE research_projects SET updated_at = ? WHERE id = ?').run(now(), project.id);
  res.status(201).json({ source: { id: sourceId, ...input, accessedAt: now().slice(0, 10), createdAt: now() } });
});

app.delete('/api/research/sources/:id', (req, res) => {
  const result = db.prepare(`DELETE FROM research_sources WHERE id = ? AND project_id IN (SELECT id FROM research_projects WHERE owner_id = ?)`).run(req.params.id, req.user!.id);
  if (!result.changes) return res.status(404).json({ error: 'Source not found.' });
  res.json({ ok: true });
});

app.get('/api/research/projects/:id/export', (req, res) => {
  const project = db.prepare('SELECT * FROM research_projects WHERE id = ? AND owner_id = ?').get(req.params.id, req.user!.id) as any;
  if (!project) return res.status(404).json({ error: 'Research project not found.' });
  const sources = db.prepare('SELECT * FROM research_sources WHERE project_id = ? ORDER BY created_at').all(project.id) as any[];
  const markdown = [`# ${project.title}`, '', project.description, '', '## Sources', '',
    ...sources.flatMap((s, index) => [`### ${index + 1}. ${s.title}`, '', `- URL: ${s.url}`, `- Author: ${s.author || 'Not supplied'}`, `- Publisher: ${s.publisher || 'Not supplied'}`, `- Publication date: ${s.publication_date || 'Not supplied'}`, `- Accessed: ${s.accessed_at}`, '', s.notes || 'No notes.', '']),
    '', '---', 'Source metadata is user-supplied unless independently verified.'].join('\n');
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="raosynapse-research-${project.id.slice(0, 8)}.md"`);
  res.send(markdown);
});

app.get('/api/developer/tokens', (req, res) => {
  const tokens = db.prepare('SELECT * FROM api_tokens WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id) as any[];
  res.json({ tokens: tokens.map(t => ({ id: t.id, name: t.name, prefix: t.prefix, scopes: JSON.parse(t.scopes), createdAt: t.created_at, lastUsedAt: t.last_used_at, revokedAt: t.revoked_at })) });
});

app.post('/api/developer/tokens', (req, res) => {
  const input = validate(z.object({ name: z.string().trim().min(1).max(80), scopes: z.array(z.enum(['messages:read', 'messages:send', 'ai:use'])).min(1) }), req.body);
  const token = `rs_${newToken()}`;
  const tokenId = id();
  db.prepare('INSERT INTO api_tokens (id, user_id, name, prefix, token_hash, scopes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(tokenId, req.user!.id, input.name, token.slice(0, 11), hashToken(token), JSON.stringify([...new Set(input.scopes)]), now());
  audit(req.user!.id, 'api_token.created', tokenId, { scopes: input.scopes });
  res.status(201).json({ token: { id: tokenId, name: input.name, secret: token, scopes: input.scopes, createdAt: now() } });
});

app.delete('/api/developer/tokens/:id', (req, res) => {
  const result = db.prepare('UPDATE api_tokens SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL').run(now(), req.params.id, req.user!.id);
  if (!result.changes) return res.status(404).json({ error: 'Active token not found.' });
  audit(req.user!.id, 'api_token.revoked', req.params.id);
  res.json({ ok: true });
});

if (isProduction) {
  app.use((_req, res, next) => {
    res.setHeader('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' ws: wss:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '));
    next();
  });
  const dist = path.join(process.cwd(), 'dist');
  app.use(express.static(dist, { maxAge: '1h', index: false }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/ws')) return next();
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found.', code: 'NOT_FOUND' });
});

app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request.', code: 'VALIDATION_FAILED', fields: error.flatten().fieldErrors });
  }
  if (String(error?.message).includes('IDEMPOTENCY_CONFLICT')) {
    return res.status(409).json({ error: 'This retry key was already used with different content.', code: 'IDEMPOTENCY_CONFLICT' });
  }
  if (String(error?.message).includes('UNIQUE constraint failed')) {
    return res.status(409).json({ error: 'This record already exists.', code: 'CONFLICT' });
  }
  console.error('[server]', error?.message || error);
  if (res.headersSent) return res.end();
  res.status(500).json({ error: 'Something went wrong. Please try again.', code: 'INTERNAL_ERROR' });
});

function parseCookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => part.trim()).filter(Boolean).map(part => {
    const index = part.indexOf('=');
    return [decodeURIComponent(part.slice(0, index)), decodeURIComponent(part.slice(index + 1))];
  }));
}

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '/', 'http://localhost');
  if (url.pathname !== '/ws') { socket.destroy(); return; }
  const origin = request.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.host) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }
    } catch {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
  }
  const cookies = parseCookies(request.headers.cookie);
  const user = userFromToken(cookies.rs_session);
  if (!user) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }
  wss.handleUpgrade(request, socket, head, ws => realtime.add(user.id, ws as any));
});

realtime.startHeartbeat();
server.listen(port, '0.0.0.0', () => {
  console.log(`RaoSynapse API listening on http://0.0.0.0:${port}`);
  console.log(`AI mode: ${aiStatus().provider} (${aiStatus().model})`);
});
