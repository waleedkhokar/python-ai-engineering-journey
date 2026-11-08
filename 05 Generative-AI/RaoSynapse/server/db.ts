import Database from 'better-sqlite3';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import path from 'node:path';

export const now = () => new Date().toISOString();
export const id = () => randomUUID();
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const newToken = () => randomBytes(32).toString('base64url');

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'raosynapse.db');
export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  display_name TEXT NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  avatar_color TEXT NOT NULL DEFAULT '#7C5CFF',
  discoverable INTEGER NOT NULL DEFAULT 1,
  message_privacy TEXT NOT NULL DEFAULT 'everyone',
  show_presence INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('ai','direct','room','snapshot')),
  title TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  next_sequence INTEGER NOT NULL DEFAULT 0,
  archived_at TEXT,
  forked_from TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS conversation_members (
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('owner','editor','viewer','member')),
  last_read_sequence INTEGER NOT NULL DEFAULT 0,
  last_delivered_sequence INTEGER NOT NULL DEFAULT 0,
  joined_at TEXT NOT NULL,
  PRIMARY KEY(conversation_id, user_id)
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  sender_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK(role IN ('user','assistant')),
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK(status IN ('streaming','completed','partial','failed')),
  client_id TEXT,
  model TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(conversation_id, sequence)
);
CREATE UNIQUE INDEX IF NOT EXISTS message_client_unique
  ON messages(conversation_id, sender_id, client_id) WHERE client_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS message_conversation_sequence
  ON messages(conversation_id, sequence);
CREATE TABLE IF NOT EXISTS ai_runs (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  request_message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  response_message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  initiating_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  model TEXT NOT NULL,
  error TEXT,
  created_at TEXT NOT NULL,
  finished_at TEXT
);
CREATE TABLE IF NOT EXISTS share_links (
  id TEXT PRIMARY KEY,
  snapshot_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  permission TEXT NOT NULL CHECK(permission IN ('view','fork')),
  created_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS invitations (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  invited_by TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined','revoked')),
  created_at TEXT NOT NULL,
  responded_at TEXT,
  UNIQUE(room_id, invited_user_id, status)
);
CREATE TABLE IF NOT EXISTS blocks (
  blocker_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY(blocker_id, blocked_id)
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS research_projects (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  conversation_id TEXT REFERENCES conversations(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS research_sources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT '',
  publisher TEXT NOT NULL DEFAULT '',
  publication_date TEXT NOT NULL DEFAULT '',
  accessed_at TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS api_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  scopes TEXT NOT NULL,
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at TEXT
);
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  resource_id TEXT,
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS member_user ON conversation_members(user_id, conversation_id);
CREATE INDEX IF NOT EXISTS invitations_user ON invitations(invited_user_id, status);
CREATE INDEX IF NOT EXISTS sources_project ON research_sources(project_id, created_at);
`);

// Remove legacy password data without changing identities or workspace content.
const legacyUserColumns = db.prepare('PRAGMA table_info(users)').all() as Array<{ name: string }>;
if (legacyUserColumns.some(column => column.name === 'password_hash')) {
  db.exec('ALTER TABLE users DROP COLUMN password_hash');
}

export type User = {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_color: string;
  discoverable: number;
  message_privacy: string;
  show_presence: number;
  created_at: string;
};

export type Conversation = {
  id: string;
  type: 'ai' | 'direct' | 'room' | 'snapshot';
  title: string;
  owner_id: string;
  next_sequence: number;
  archived_at: string | null;
  forked_from: string | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sequence: number;
  sender_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  status: 'streaming' | 'completed' | 'partial' | 'failed';
  client_id: string | null;
  model: string | null;
  created_at: string;
};

export function publicUser(user: User) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.display_name,
    bio: user.bio,
    avatarColor: user.avatar_color,
    discoverable: !!user.discoverable,
    messagePrivacy: user.message_privacy,
    showPresence: !!user.show_presence,
    createdAt: user.created_at,
  };
}

export function getUser(idValue: string) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(idValue) as User | undefined;
}

export function getConversation(conversationId: string) {
  return db.prepare('SELECT * FROM conversations WHERE id = ?').get(conversationId) as Conversation | undefined;
}

export function membership(conversationId: string, userId: string) {
  return db.prepare('SELECT * FROM conversation_members WHERE conversation_id = ? AND user_id = ?').get(conversationId, userId) as any;
}

export function canRead(conversationId: string, userId: string) {
  return !!membership(conversationId, userId);
}

export function canWrite(conversationId: string, userId: string) {
  const member = membership(conversationId, userId);
  return !!member && member.role !== 'viewer';
}

export function serializeMessage(message: Message, viewerId?: string) {
  let delivery: 'sent' | 'delivered' | 'read' = 'sent';
  if (viewerId && message.sender_id === viewerId) {
    const states = db.prepare(`
      SELECT last_delivered_sequence, last_read_sequence FROM conversation_members
      WHERE conversation_id = ? AND user_id != ?
    `).all(message.conversation_id, viewerId) as any[];
    if (states.length && states.every(s => s.last_delivered_sequence >= message.sequence)) delivery = 'delivered';
    if (states.length && states.every(s => s.last_read_sequence >= message.sequence)) delivery = 'read';
  }
  const sender = message.sender_id ? getUser(message.sender_id) : null;
  return {
    id: message.id,
    conversationId: message.conversation_id,
    sequence: message.sequence,
    senderId: message.sender_id,
    senderName: sender?.display_name || (message.role === 'assistant' ? 'Synapse AI' : 'Deleted user'),
    senderUsername: sender?.username || null,
    avatarColor: sender?.avatar_color || '#7C5CFF',
    role: message.role,
    content: message.content,
    status: message.status,
    clientId: message.client_id,
    model: message.model,
    delivery,
    createdAt: message.created_at,
  };
}

const insertMessageTx = db.transaction((conversationId: string, senderId: string | null, role: 'user' | 'assistant', content: string, clientId?: string, status = 'completed', model?: string) => {
  const conversation = getConversation(conversationId);
  if (!conversation) throw new Error('CONVERSATION_NOT_FOUND');
  if (clientId && senderId) {
    const existing = db.prepare('SELECT * FROM messages WHERE conversation_id = ? AND sender_id = ? AND client_id = ?').get(conversationId, senderId, clientId) as Message | undefined;
    if (existing) {
      if (existing.content !== content) throw new Error('IDEMPOTENCY_CONFLICT');
      return existing;
    }
  }
  db.prepare('UPDATE conversations SET next_sequence = next_sequence + 1, updated_at = ? WHERE id = ?').run(now(), conversationId);
  const sequence = (getConversation(conversationId)?.next_sequence || 1) as number;
  const messageId = id();
  db.prepare(`INSERT INTO messages (id, conversation_id, sequence, sender_id, role, content, status, client_id, model, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(messageId, conversationId, sequence, senderId, role, content, status, clientId || null, model || null, now());
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(messageId) as Message;
});

export function addMessage(conversationId: string, senderId: string | null, role: 'user' | 'assistant', content: string, clientId?: string, status: Message['status'] = 'completed', model?: string) {
  return insertMessageTx(conversationId, senderId, role, content, clientId, status, model);
}

export const createConversationTx = db.transaction((type: Conversation['type'], title: string, ownerId: string, role = 'owner') => {
  const conversationId = id();
  const timestamp = now();
  db.prepare('INSERT INTO conversations (id, type, title, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(conversationId, type, title, ownerId, timestamp, timestamp);
  db.prepare('INSERT INTO conversation_members (conversation_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)')
    .run(conversationId, ownerId, role, timestamp);
  return getConversation(conversationId)!;
});

export function createConversation(type: Conversation['type'], title: string, ownerId: string) {
  return createConversationTx(type, title, ownerId);
}

export function conversationSummary(conversation: Conversation, userId: string) {
  const member = membership(conversation.id, userId);
  const last = db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY sequence DESC LIMIT 1').get(conversation.id) as Message | undefined;
  const unread = db.prepare('SELECT COUNT(*) AS count FROM messages WHERE conversation_id = ? AND sequence > ? AND (sender_id IS NULL OR sender_id != ?)')
    .get(conversation.id, member?.last_read_sequence || 0, userId) as any;
  const members = db.prepare(`SELECT u.*, cm.role, cm.last_read_sequence, cm.last_delivered_sequence
    FROM conversation_members cm JOIN users u ON u.id = cm.user_id WHERE cm.conversation_id = ?`).all(conversation.id) as any[];
  return {
    id: conversation.id,
    type: conversation.type,
    title: conversation.title,
    ownerId: conversation.owner_id,
    role: member?.role,
    archived: !!conversation.archived_at,
    forkedFrom: conversation.forked_from,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
    lastMessage: last ? { content: last.content, createdAt: last.created_at, role: last.role } : null,
    unread: Number(unread.count || 0),
    members: members.map(m => ({ ...publicUser(m), role: m.role, lastReadSequence: m.last_read_sequence, lastDeliveredSequence: m.last_delivered_sequence })),
  };
}

export function listConversations(userId: string, type?: string, query = '') {
  const rows = db.prepare(`
    SELECT c.* FROM conversations c JOIN conversation_members cm ON cm.conversation_id = c.id
    WHERE cm.user_id = ? AND c.type != 'snapshot'
    ORDER BY c.updated_at DESC
  `).all(userId) as Conversation[];
  return rows
    .filter(c => !type || c.type === type)
    .filter(c => !query || c.title.toLowerCase().includes(query.toLowerCase()) || !!db.prepare('SELECT 1 FROM messages WHERE conversation_id = ? AND content LIKE ? LIMIT 1').get(c.id, `%${query}%`))
    .map(c => conversationSummary(c, userId));
}

export function copyConversation(sourceId: string, destinationType: 'ai' | 'snapshot' | 'room', destinationTitle: string, actorId: string) {
  return db.transaction(() => {
    const source = getConversation(sourceId);
    if (!source) throw new Error('CONVERSATION_NOT_FOUND');
    const destination = createConversation(destinationType, destinationTitle, actorId);
    db.prepare('UPDATE conversations SET forked_from = ? WHERE id = ?').run(sourceId, destination.id);
    const messages = db.prepare("SELECT * FROM messages WHERE conversation_id = ? AND content != '' ORDER BY sequence").all(sourceId) as Message[];
    for (const message of messages) {
      addMessage(destination.id, message.sender_id, message.role, message.content, undefined, message.status === 'streaming' ? 'partial' : message.status, message.model || undefined);
    }
    return destination;
  })();
}

export function audit(actorId: string | null, eventType: string, resourceId?: string, metadata: Record<string, unknown> = {}) {
  db.prepare('INSERT INTO audit_events (id, actor_id, event_type, resource_id, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id(), actorId, eventType, resourceId || null, JSON.stringify(metadata), now());
}

function seed() {
  const count = db.prepare('SELECT COUNT(*) AS count FROM users').get() as any;
  if (count.count > 0) return;
  const alexId = id();
  const samId = id();
  const timestamp = now();
  const insertUser = db.prepare(`INSERT INTO users (id, username, display_name, bio, avatar_color, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`);
  insertUser.run(alexId, 'alex', 'Alex Rao', 'Exploring collaborative intelligence.', '#7C5CFF', timestamp);
  insertUser.run(samId, 'sam', 'Sam Chen', 'Research, design, and useful technology.', '#35D0BA', timestamp);

  const welcome = createConversation('ai', 'Welcome to RaoSynapse', alexId);
  addMessage(welcome.id, alexId, 'user', 'What can I do here?', 'seed-user');
  addMessage(welcome.id, null, 'assistant', 'Welcome to **RaoSynapse** — a workspace for thinking, connecting, and building with context.\n\nYou can:\n- Investigate with Synapse AI\n- Share a snapshot or fork a conversation\n- Message other members\n- Build a shared Room\n- Organize sources in Research\n\nTry creating a new conversation, or enter as **sam** in another browser to explore person-to-person collaboration.', 'seed-assistant', 'completed', 'welcome');

  const room = createConversation('room', 'Collaborative AI Lab', alexId);
  db.prepare('INSERT INTO conversation_members (conversation_id, user_id, role, joined_at) VALUES (?, ?, ?, ?)').run(room.id, samId, 'editor', timestamp);
  addMessage(room.id, alexId, 'user', 'Welcome to our shared intelligence space. Messages here are persisted and synchronized.', 'seed-room-1');
  addMessage(room.id, samId, 'user', 'I can contribute, add research, or ask AI to work from our shared context.', 'seed-room-2');

  const projectId = id();
  db.prepare('INSERT INTO research_projects (id, owner_id, title, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(projectId, alexId, 'Responsible AI notes', 'A working research project with user-supplied source metadata.', timestamp, timestamp);
  db.prepare(`INSERT INTO research_sources (id, project_id, url, title, publisher, accessed_at, notes, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id(), projectId, 'https://www.nist.gov/itl/ai-risk-management-framework', 'NIST AI Risk Management Framework', 'NIST', timestamp.slice(0, 10), 'User-supplied source. Verify relevance before citing.', alexId, timestamp);
}

// Demo identities are convenient locally but must never be created silently in production.
if (process.env.SEED_DEMO === 'true' || (!process.env.SEED_DEMO && process.env.NODE_ENV !== 'production')) {
  seed();
  db.prepare("UPDATE conversations SET title = REPLACE(title, '[Demo] ', '') WHERE title LIKE '[Demo] %'").run();
  db.prepare("UPDATE research_projects SET title = REPLACE(title, '[Demo] ', ''), description = REPLACE(description, 'A demonstration research project', 'A working research project')").run();
  db.prepare("UPDATE research_sources SET notes = REPLACE(notes, 'User-supplied demonstration source.', 'User-supplied source.')").run();
  db.prepare("UPDATE messages SET content = REPLACE(content, 'This is a clearly labelled demonstration conversation.', 'This is your RaoSynapse workspace.') WHERE content LIKE '%demonstration conversation%'").run();
}
