import { Search, Plus, Bot, MessageCircle, UsersRound, Archive } from 'lucide-react';
import type { Conversation } from '../types';
import { cx, relativeTime, truncate } from '../lib/utils';
import { Avatar, EmptyState } from './UI';
import { useAuth } from '../lib/auth';

export default function ConversationList({ conversations, activeId, onSelect, onNew, query, setQuery, kind, loading }: {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  query: string;
  setQuery: (query: string) => void;
  kind: 'ai' | 'direct' | 'room';
  loading?: boolean;
}) {
  const { user } = useAuth();
  const labels = {
    ai: ['AI conversations', 'New chat'],
    direct: ['People & messages', 'New message'],
    room: ['Your rooms', 'New room'],
  }[kind];
  const Icon = kind === 'ai' ? Bot : kind === 'direct' ? MessageCircle : UsersRound;

  return <aside className={cx('conversation-sidebar', activeId && 'has-active', kind === 'direct' && 'direct-conversation-sidebar')}>
    <div className="conversation-list-header"><div><h2>{labels[0]}</h2><span>{conversations.length}</span></div><button className="icon-button accent" onClick={onNew} aria-label={labels[1]}><Plus size={19} /></button></div>
    <div className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={kind === 'direct' ? 'Search people or messages…' : `Search ${kind === 'room' ? 'rooms' : 'conversations'}…`} aria-label="Search conversations" /></div>
    {kind === 'direct' && <div className="direct-list-caption"><span className="direct-live-dot" />Realtime presence and private history</div>}
    <div className="conversation-list">
      {loading && <div className="list-skeleton">{[1, 2, 3].map(i => <i key={i} />)}</div>}
      {!loading && conversations.length === 0 && <EmptyState icon={<Icon size={22} />} title={query ? 'No matches' : kind === 'direct' ? 'No private messages yet' : `No ${kind === 'room' ? 'rooms' : 'conversations'} yet`} description={query ? 'Try a different search.' : kind === 'direct' ? 'Choose New message to find someone and start a conversation.' : 'Start something new to see it here.'} />}
      {conversations.map(conversation => {
        const other = kind === 'direct' ? conversation.members.find(member => member.id !== user?.id) : null;
        return <button key={conversation.id} onClick={() => onSelect(conversation.id)} className={cx('conversation-list-item', activeId === conversation.id && 'active', other && 'direct-conversation-item')}>
          <span className={cx('conversation-type-icon', `type-${kind}`, other && 'conversation-contact-avatar')}>{other ? <Avatar name={other.displayName} color={other.avatarColor} size="sm" online={other.online} /> : <Icon size={17} />}</span>
          <span className="conversation-item-copy">
            <span className="conversation-item-top"><strong>{other?.displayName || conversation.title}</strong><time>{relativeTime(conversation.updatedAt)}</time></span>
            {other && <span className="conversation-contact-meta">@{other.username}<i />{other.online ? 'Online now' : 'Offline'}</span>}
            <span className="conversation-preview">{conversation.archived ? <><Archive size={12} /> Archived · </> : null}{conversation.lastMessage ? truncate(conversation.lastMessage.content, 55) : other ? `Start a private conversation with ${other.displayName}` : 'No messages yet'}</span>
          </span>
          {conversation.unread > 0 && <b className="unread-badge">{conversation.unread}</b>}
        </button>;
      })}
    </div>
  </aside>;
}
