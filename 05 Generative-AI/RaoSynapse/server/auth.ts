import type { NextFunction, Request, Response } from 'express';
import { db, getUser, hashToken, newToken, now, publicUser, type User } from './db.js';

const COOKIE_NAME = 'rs_session';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      sessionToken?: string;
      apiUser?: User;
      apiScopes?: string[];
    }
  }
}

export function createSession(res: Response, userId: string) {
  const token = newToken();
  const days = Number(process.env.SESSION_DAYS || 30);
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(hashToken(token), userId, expires.toISOString(), now());
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    expires,
    path: '/',
  });
}

export function userFromToken(token?: string): User | undefined {
  if (!token) return undefined;
  const session = db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(hashToken(token)) as any;
  if (!session) return undefined;
  if (new Date(session.expires_at).getTime() <= Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
    return undefined;
  }
  return getUser(session.user_id);
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  req.sessionToken = token;
  req.user = userFromToken(token);
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'Enter your username to continue.', code: 'UNAUTHENTICATED' });
  next();
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return next();
  if (req.path.startsWith('/api/v1/')) return next();
  if (req.get('x-raosynapse-client') !== 'web') {
    return res.status(403).json({ error: 'Request origin could not be verified.', code: 'CSRF_REJECTED' });
  }
  next();
}

export function logout(req: Request, res: Response) {
  if (req.sessionToken) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(req.sessionToken));
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

export function currentUser(req: Request) {
  return publicUser(req.user!);
}
