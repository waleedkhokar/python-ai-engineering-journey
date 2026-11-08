import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Code2, FlaskConical, LayoutDashboard, LoaderCircle, MessageCircle, Plus, Search, Settings, UsersRound, X } from 'lucide-react';
import { api, json, toast } from '../lib/api';
import type { Conversation } from '../types';
import { cx, relativeTime, truncate } from '../lib/utils';

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  keywords?: string;
  run: () => void | Promise<void>;
};

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const timer = setTimeout(() => inputRef.current?.focus(), 40);
    api<{ conversations: Conversation[] }>('/api/conversations')
      .then(result => setConversations(result.conversations.slice(0, 7)))
      .catch(() => {});
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) {
      if (open) api<{ conversations: Conversation[] }>('/api/conversations').then(result => setConversations(result.conversations.slice(0, 7))).catch(() => {});
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      api<{ conversations: Conversation[] }>(`/api/conversations?query=${encodeURIComponent(query.trim())}`)
        .then(result => { setConversations(result.conversations.slice(0, 9)); setActive(0); })
        .catch(error => toast(error.message, 'error'))
        .finally(() => setLoading(false));
    }, 180);
    return () => clearTimeout(timer);
  }, [query, open]);

  const createAI = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const result = await api<{ conversation: Conversation }>('/api/conversations', { method: 'POST', body: json({ type: 'ai' }) });
      navigate(`/app/ai/${result.conversation.id}`);
      onClose();
    } catch (error: any) { toast(error.message, 'error'); }
    finally { setCreating(false); }
  };

  const items = useMemo<CommandItem[]>(() => {
    const go = (path: string) => () => { navigate(path); onClose(); };
    const actions: CommandItem[] = [
      { id: 'new-ai', title: 'Start a new intelligence thread', subtitle: 'Create a private Synapse AI conversation', icon: Plus, keywords: 'new chat ask create', run: createAI },
      { id: 'new-message', title: 'Message a person', subtitle: 'Choose a contact and write an opening message', icon: MessageCircle, keywords: 'new direct private person contact chat', run: go('/app/messages?new=1') },
      { id: 'new-room', title: 'Create a collaborative room', subtitle: 'Start a shared human and AI timeline', icon: UsersRound, keywords: 'new group team collaborate', run: go('/app/rooms?new=1') },
      { id: 'new-research', title: 'Create a research project', subtitle: 'Collect sources, provenance, and notes', icon: FlaskConical, keywords: 'new evidence citation sources', run: go('/app/research?new=1') },
      { id: 'overview', title: 'Workspace overview', subtitle: 'Recent activity and quick actions', icon: LayoutDashboard, keywords: 'home dashboard', run: go('/app') },
      { id: 'messages', title: 'Open person chat', subtitle: 'Direct messages, presence, and read receipts', icon: MessageCircle, keywords: 'chat direct people messages', run: go('/app/messages') },
      { id: 'rooms', title: 'Open collaborative rooms', subtitle: 'People and AI in one timeline', icon: UsersRound, keywords: 'team group invite', run: go('/app/rooms') },
      { id: 'research', title: 'Open research', subtitle: 'Projects, sources, and notes', icon: FlaskConical, keywords: 'citation source evidence', run: go('/app/research') },
      { id: 'developer', title: 'Developer API', subtitle: 'Tokens and live endpoints', icon: Code2, keywords: 'token integration curl', run: go('/app/developer') },
      { id: 'settings', title: 'Profile and privacy settings', subtitle: 'Identity, sessions, and account controls', icon: Settings, keywords: 'account privacy security', run: go('/app/settings') },
    ];
    const normalized = query.trim().toLowerCase();
    const filteredActions = normalized
      ? actions.filter(item => `${item.title} ${item.subtitle} ${item.keywords}`.toLowerCase().includes(normalized))
      : actions.slice(0, 3);
    const conversationItems = conversations.map(conversation => ({
      id: conversation.id,
      title: conversation.title,
      subtitle: `${conversation.type === 'ai' ? 'AI conversation' : conversation.type === 'room' ? 'Collaborative room' : 'Private message'} · ${conversation.lastMessage ? truncate(conversation.lastMessage.content, 65) : relativeTime(conversation.updatedAt)}`,
      icon: conversation.type === 'ai' ? Bot : conversation.type === 'room' ? UsersRound : MessageCircle,
      run: go(`${conversation.type === 'ai' ? '/app/ai' : conversation.type === 'room' ? '/app/rooms' : '/app/messages'}/${conversation.id}`),
    }));
    return [...filteredActions, ...conversationItems];
  }, [conversations, query, creating]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key === 'ArrowDown') { event.preventDefault(); setActive(index => Math.min(index + 1, items.length - 1)); }
      if (event.key === 'ArrowUp') { event.preventDefault(); setActive(index => Math.max(index - 1, 0)); }
      if (event.key === 'Enter' && items[active]) { event.preventDefault(); items[active].run(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, items, active, onClose]);

  if (!open) return null;
  return <div className="command-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="command-palette" role="dialog" aria-modal="true" aria-label="Quick search and commands">
      <div className="command-input"><Search size={20} /><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search your intelligence or jump to…" aria-label="Search conversations and commands" />{loading ? <LoaderCircle size={17} className="spin" /> : <button onClick={onClose} aria-label="Close quick search"><X size={17} /></button>}</div>
      <div className="command-results">
        <div className="command-group-label">{query ? `${items.length} result${items.length === 1 ? '' : 's'}` : 'QUICK ACTIONS & RECENT WORK'}</div>
        {items.length === 0 && <div className="command-empty"><Search size={23} /><strong>No matching intelligence</strong><p>Try another phrase or start a new thread.</p></div>}
        {items.map((item, index) => <button key={item.id} className={cx('command-item', active === index && 'active')} onMouseEnter={() => setActive(index)} onClick={() => item.run()}>
          <span className="command-item-icon"><item.icon size={17} /></span>
          <span><strong>{item.title}</strong><small>{item.subtitle}</small></span>
          {item.id === 'new-ai' && creating ? <LoaderCircle size={15} className="spin" /> : <ArrowRight size={14} />}
        </button>)}
      </div>
      <footer className="command-footer"><span><kbd>↑</kbd><kbd>↓</kbd>Navigate</span><span><kbd>↵</kbd>Open</span><span><kbd>esc</kbd>Close</span><b>RaoSynapse</b></footer>
    </section>
  </div>;
}
