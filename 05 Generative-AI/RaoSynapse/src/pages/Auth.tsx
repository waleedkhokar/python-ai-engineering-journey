import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, Check, MessageCircle, ShieldCheck, UserRound, UsersRound } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Logo, Spinner } from '../components/UI';
import { peekChatDraft } from '../lib/draft';

export default function Auth() {
  const { user, loading: authLoading, enter } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const displayNameRef = useRef<HTMLInputElement>(null);

  const pendingDraft = peekChatDraft();
  const personChat = searchParams.get('from') === 'people';
  const destination = pendingDraft ? '/app/ai?new=1&draft=1' : personChat ? '/app/messages?new=1' : '/app';
  if (!authLoading && user) return <Navigate to={destination} replace />;

  const openWorkspace = async (name: string, display?: string) => {
    setBusy(true);
    setError('');
    try {
      await enter(name, display);
      navigate(destination);
      return true;
    } catch (err: any) {
      setError(err.message || 'Could not open the workspace. Please try again.');
      setBusy(false);
      return false;
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const opened = await openWorkspace(username, displayName.trim() || undefined);
    if (!opened && !displayName.trim()) displayNameRef.current?.focus();
  };

  return <div className="access-page">
    <header className="access-header"><div className="access-header-inner"><Link to="/" aria-label="RaoSynapse home"><Logo /></Link><div><span>No password required</span><Link to="/">Product overview<ArrowRight size={14} /></Link></div></div></header>
    <main className="access-main">
      <aside className="access-aside">
        <Link to="/" className="access-back"><ArrowLeft size={15} />Back to the website</Link>
        <div className="access-aside-copy"><span className="access-eyebrow">PEOPLE + AI + RESEARCH</span><h2>One username.<br />Every conversation.</h2><p>Enter a real persistent workspace for direct person chat, shared rooms, private AI thinking, and connected research.</p>
          <div className="access-benefits"><div><span><MessageCircle size={18} /></span><div><b>Talk person to person</b><small>Live presence, realtime messages, and read receipts</small></div></div><div><span><Bot size={18} /></span><div><b>Think with context</b><small>Private, persistent Synapse AI conversations</small></div></div><div><span><UsersRound size={18} /></span><div><b>Build with others</b><small>Rooms, snapshots, forks, and shared research</small></div></div></div>
        </div>
        <div className="access-trust"><ShieldCheck size={17} /><p><b>Persistent workspace access.</b><br />Server sessions and permissions remain active. Username-only entry is intended for non-sensitive use.</p></div>
      </aside>

      <section className="access-form-section">
        <div className="access-form-card">
          <span className="access-form-kicker">YOUR WORKSPACE, SIMPLIFIED</span>
          <h1>Enter with your username</h1>
          <p>Existing usernames open their workspace. New usernames need a display name and create one automatically.</p>
          {pendingDraft && <div className="access-pending-prompt"><Bot size={17} /><div><b>Your prompt is ready.</b><p>Continue to open a new AI thread and start this conversation automatically.</p></div></div>}
          {personChat && !pendingDraft && <div className="access-pending-prompt access-person-pending"><MessageCircle size={17} /><div><b>Person chat is your next stop.</b><p>Enter below, then choose a person and write an opening message.</p></div></div>}

          <div className="access-identity-note"><UserRound size={17} /><div><b>Just your identity. No password.</b><span>3–24 letters, numbers, or underscores.</span></div></div>
          <form onSubmit={submit} className="access-form">
            <label><span>Unique username</span><div className="access-input"><UserRound size={17} /><input autoFocus autoComplete="username" autoCapitalize="none" spellCheck={false} value={username} onChange={event => { setUsername(event.target.value); setError(''); }} placeholder="e.g. your_name" pattern="[a-zA-Z0-9_]{3,24}" maxLength={24} aria-invalid={!!error} required /></div><small>Existing usernames continue. New usernames must be unique.</small></label>
            <label><span>Display name <em>(for a new username)</em></span><div className="access-input"><MessageCircle size={17} /><input ref={displayNameRef} autoComplete="name" value={displayName} onChange={event => { setDisplayName(event.target.value); setError(''); }} placeholder="How people will see you" maxLength={60} /></div><small>Not needed when opening an existing username.</small></label>
            {error && <div className="access-error" role="alert"><span>{error}</span></div>}
            <button className="access-submit" disabled={busy || username.trim().length < 3}>{busy ? <Spinner /> : <>Enter workspace<ArrowRight size={17} /></>}</button>
          </form>

          <div className="access-divider"><span>or continue with an example workspace</span></div>
          <div className="access-demo-accounts">
            <button onClick={() => openWorkspace('alex')} disabled={busy}><span className="access-demo-avatar">AR</span><div><b>Continue as Alex</b><small>Explore AI, rooms, and research</small></div><ArrowRight size={16} /></button>
            <button onClick={() => openWorkspace('sam')} disabled={busy}><span className="access-demo-avatar second">SC</span><div><b>Continue as Sam</b><small>Open another identity for person chat</small></div><ArrowRight size={16} /></button>
          </div>
          <p className="access-demo-password"><Check size={13} />No password is required for these example identities.</p>
        </div>
        <p className="access-legal">Username-only access is intentionally simple for this preview. Anyone who knows a username can open it, so do not use sensitive information.</p>
      </section>
    </main>
    <footer className="access-footer"><span>© {new Date().getFullYear()} RaoSynapse</span><div><Link to="/">Product</Link><Link to="/#security">Privacy approach</Link><span>Preview environment</span></div></footer>
  </div>;
}
