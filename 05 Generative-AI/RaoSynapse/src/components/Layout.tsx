import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Bot, ChevronDown, Code2, FlaskConical, Info, LayoutDashboard, LogOut, MessageCircle, Plus, Search, Settings, UsersRound, Wifi, WifiOff, X } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRealtime } from '../lib/realtime';
import { Avatar, Logo } from './UI';
import CommandPalette from './CommandPalette';
import { api } from '../lib/api';
import { cx } from '../lib/utils';

const nav = [
  { to: '/app', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/app/ai', label: 'Synapse AI', icon: Bot },
  { to: '/app/messages', label: 'Person chat', icon: MessageCircle },
  { to: '/app/rooms', label: 'Rooms', icon: UsersRound },
  { to: '/app/research', label: 'Research', icon: FlaskConical },
  { to: '/app/developer', label: 'Developer', icon: Code2 },
  { to: '/about', label: 'About', icon: Info },
];

const createItems = [
  { to: '/app/ai?new=1', label: 'New AI conversation', description: 'Start a private Synapse AI thread', icon: Bot },
  { to: '/app/messages?new=1', label: 'New person chat', description: 'Find a person and write an opening message', icon: MessageCircle },
  { to: '/app/rooms?new=1', label: 'New collaborative room', description: 'Bring people and AI into shared context', icon: UsersRound },
  { to: '/app/research?new=1', label: 'New research project', description: 'Organize sources, provenance, and notes', icon: FlaskConical },
];

export default function Layout() {
  const { user, ai, logout } = useAuth();
  const { connected } = useRealtime();
  const [commandOpen, setCommandOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; tone: string }>>([]);
  const [invites, setInvites] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const createRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const item = { id: Date.now() + Math.random(), ...detail };
      setToasts(current => [...current, item]);
      setTimeout(() => setToasts(current => current.filter(toast => toast.id !== item.id)), 4200);
    };
    window.addEventListener('raosynapse-toast', handler);
    return () => window.removeEventListener('raosynapse-toast', handler);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(value => !value);
      }
      if (event.key === 'Escape') { setCreateOpen(false); setProfileOpen(false); }
    };
    const pointer = (event: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(event.target as Node)) setCreateOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('keydown', handler);
    document.addEventListener('mousedown', pointer);
    return () => { document.removeEventListener('keydown', handler); document.removeEventListener('mousedown', pointer); };
  }, []);

  useEffect(() => {
    setCreateOpen(false);
    setProfileOpen(false);
    api<{ invitations: unknown[] }>('/api/invitations').then(result => setInvites(result.invitations.length)).catch(() => {});
  }, [location.pathname]);

  const signOut = async () => { await logout(); window.location.replace('/'); };

  return <div className="product-shell">
    <header className="product-header">
      <div className="product-header-main">
        <Link to="/app" className="product-brand" aria-label="RaoSynapse workspace home"><Logo /></Link>
        <nav className="product-nav" aria-label="Workspace navigation">
          {nav.map(item => <NavItem key={item.to} {...item} badge={item.to === '/app/rooms' ? invites : 0} />)}
        </nav>
        <div className="product-actions">
          <div className="product-create-wrap" ref={createRef}>
            <button className="product-create-button" onClick={() => { setCreateOpen(value => !value); setProfileOpen(false); }} aria-expanded={createOpen} aria-haspopup="menu"><Plus size={16} /><span>Create</span><ChevronDown size={13} /></button>
            {createOpen && <div className="product-menu product-create-menu" role="menu"><span className="product-menu-label">START SOMETHING NEW</span>{createItems.map(item => <button key={item.to} role="menuitem" onClick={() => navigate(item.to)}><span><item.icon size={17} /></span><div><strong>{item.label}</strong><small>{item.description}</small></div></button>)}</div>}
          </div>
          <button className="product-search" onClick={() => setCommandOpen(true)} aria-label="Open quick search"><Search size={16} /><span>Search</span><kbd>⌘ K</kbd></button>
          <span className={cx('connection-pill product-status', connected && 'connected')} title={connected ? 'Realtime connected' : 'Realtime reconnecting'}>{connected ? <Wifi size={14} /> : <WifiOff size={14} />}<span>{connected ? 'Live' : 'Reconnecting'}</span></span>
          {ai && <span className={cx('ai-mode-pill product-ai-status', !ai.configured && 'preview')} title={ai.configured ? `Groq model: ${ai.model}` : 'Add GROQ_API_KEY to enable real Groq responses'}><span />{ai.configured ? 'Groq connected' : 'Preview AI'}</span>}
          <button className="icon-button notification-button product-bell" aria-label={`${invites} pending invitations`} onClick={() => navigate('/app/rooms')}><Bell size={18} />{invites > 0 && <i>{invites}</i>}</button>
          <div className="product-profile-wrap" ref={profileRef}>
            <button className="product-profile-button" onClick={() => { setProfileOpen(value => !value); setCreateOpen(false); }} aria-expanded={profileOpen} aria-haspopup="menu" aria-label="Open account menu"><Avatar name={user!.displayName} color={user!.avatarColor} /><span><strong>{user!.displayName}</strong><small>@{user!.username}</small></span><ChevronDown size={14} /></button>
            {profileOpen && <div className="product-menu product-profile-menu" role="menu"><div className="product-profile-summary"><Avatar name={user!.displayName} color={user!.avatarColor} /><div><strong>{user!.displayName}</strong><small>@{user!.username}</small></div></div><button role="menuitem" onClick={() => navigate('/app/settings')}><Settings size={16} />Profile & settings</button><button role="menuitem" onClick={signOut}><LogOut size={16} />Sign out</button></div>}
          </div>
        </div>
      </div>
    </header>
    <main className="product-content"><Outlet /></main>
    <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
    <div className="toast-viewport" aria-live="polite">{toasts.map(item => <div className={cx('toast', `toast-${item.tone}`)} key={item.id}><span />{item.message}<button onClick={() => setToasts(current => current.filter(toast => toast.id !== item.id))}><X size={14} /></button></div>)}</div>
  </div>;
}

function NavItem({ to, label, icon: Icon, end, badge = 0 }: any) {
  return <NavLink to={to} end={end} className={({ isActive }) => cx('product-nav-link', isActive && 'active')}>
    <Icon size={16} strokeWidth={1.9} /><span>{label}</span>{badge > 0 && <b className="nav-badge">{badge}</b>}
  </NavLink>;
}
