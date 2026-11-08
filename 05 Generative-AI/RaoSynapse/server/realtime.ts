import type { WebSocket } from 'ws';
import { db, membership, now } from './db.js';

type Socket = WebSocket & { userId: string; isAlive: boolean };

class RealtimeHub {
  private connections = new Map<string, Set<Socket>>();

  add(userId: string, socket: Socket) {
    socket.userId = userId;
    socket.isAlive = true;
    const set = this.connections.get(userId) || new Set<Socket>();
    set.add(socket);
    this.connections.set(userId, set);

    socket.on('pong', () => { socket.isAlive = true; });
    socket.on('close', () => {
      set.delete(socket);
      if (!set.size) this.connections.delete(userId);
      this.sendPresence(userId);
    });
    socket.on('message', raw => {
      try {
        const event = JSON.parse(String(raw));
        if (event.type === 'ping') return socket.send(JSON.stringify({ type: 'pong', at: now() }));
        if (event.type === 'delivered' && typeof event.conversationId === 'string') {
          const member = membership(event.conversationId, userId);
          const sequence = Number(event.sequence);
          if (!member || !Number.isInteger(sequence) || sequence < 0) return;
          db.prepare(`UPDATE conversation_members SET last_delivered_sequence = MAX(last_delivered_sequence, ?)
            WHERE conversation_id = ? AND user_id = ?`).run(sequence, event.conversationId, userId);
          this.broadcastConversation(event.conversationId, {
            type: 'receipt_updated', conversationId: event.conversationId, userId,
            deliveredSequence: sequence, readSequence: member.last_read_sequence,
          });
        }
      } catch { /* Invalid realtime commands are ignored safely. */ }
    });
    socket.send(JSON.stringify({ type: 'ready', userId, at: now() }));
    this.sendPresence(userId);
  }

  isOnline(userId: string) {
    return !!this.connections.get(userId)?.size;
  }

  sendToUser(userId: string, event: unknown) {
    const sockets = this.connections.get(userId);
    if (!sockets) return;
    const payload = JSON.stringify(event);
    for (const socket of sockets) {
      if (socket.readyState === socket.OPEN) socket.send(payload);
    }
  }

  broadcastConversation(conversationId: string, event: unknown, exceptUserId?: string) {
    const members = db.prepare('SELECT user_id FROM conversation_members WHERE conversation_id = ?').all(conversationId) as any[];
    for (const member of members) {
      if (member.user_id !== exceptUserId) this.sendToUser(member.user_id, event);
    }
  }

  private sendPresence(userId: string) {
    const contacts = db.prepare(`
      SELECT DISTINCT cm2.user_id AS contact_id
      FROM conversation_members cm1
      JOIN conversations c ON c.id = cm1.conversation_id AND c.type IN ('direct','room')
      JOIN conversation_members cm2 ON cm2.conversation_id = cm1.conversation_id
      WHERE cm1.user_id = ? AND cm2.user_id != ?
    `).all(userId, userId) as any[];
    for (const contact of contacts) {
      this.sendToUser(contact.contact_id, { type: 'presence', userId, online: this.isOnline(userId) });
    }
  }

  startHeartbeat() {
    const timer = setInterval(() => {
      for (const sockets of this.connections.values()) {
        for (const socket of sockets) {
          if (!socket.isAlive) { socket.terminate(); continue; }
          socket.isAlive = false;
          socket.ping();
        }
      }
    }, 30000);
    timer.unref();
  }
}

export const realtime = new RealtimeHub();
