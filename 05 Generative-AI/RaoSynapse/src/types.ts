export type User = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  discoverable: boolean;
  messagePrivacy: 'everyone' | 'nobody';
  showPresence: boolean;
  createdAt: string;
  online?: boolean | null;
  role?: 'owner' | 'editor' | 'viewer' | 'member';
};

export type Message = {
  id: string;
  conversationId: string;
  sequence: number;
  senderId: string | null;
  senderName: string;
  senderUsername: string | null;
  avatarColor: string;
  role: 'user' | 'assistant';
  content: string;
  status: 'streaming' | 'completed' | 'partial' | 'failed' | 'sending';
  clientId?: string | null;
  model?: string | null;
  delivery: 'sent' | 'delivered' | 'read' | 'sending';
  createdAt: string;
};

export type Conversation = {
  id: string;
  type: 'ai' | 'direct' | 'room' | 'snapshot';
  title: string;
  ownerId: string;
  role: 'owner' | 'editor' | 'viewer' | 'member';
  archived: boolean;
  forkedFrom?: string | null;
  createdAt: string;
  updatedAt: string;
  unread: number;
  lastMessage?: { content: string; createdAt: string; role: string } | null;
  members: User[];
  messages?: Message[];
};

export type AIStatus = { configured: boolean; provider: string; model: string };

export type ResearchProject = {
  id: string;
  title: string;
  description: string;
  conversationId?: string | null;
  sourceCount?: number;
  createdAt: string;
  updatedAt: string;
  sources?: ResearchSource[];
};

export type ResearchSource = {
  id: string;
  url: string;
  title: string;
  author: string;
  publisher: string;
  publicationDate: string;
  accessedAt: string;
  notes: string;
  createdAt: string;
};

export type Invitation = { id: string; roomId: string; roomTitle: string; inviterName: string; createdAt: string };
