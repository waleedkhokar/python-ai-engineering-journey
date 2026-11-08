import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Bot, GitFork, LockKeyhole, ShieldCheck } from 'lucide-react';
import { api, toast } from '../lib/api';
import type { Conversation, Message } from '../types';
import { Avatar, EmptyState, Logo, Spinner } from '../components/UI';
import { messageTime } from '../lib/utils';

export default function Shared() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [shared, setShared] = useState<any>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { api<{ shared: any }>(`/api/shared/${token}`).then(result => setShared(result.shared)).catch(error => setError(error.message)); }, [token]);
  const fork = async () => {
    setBusy(true);
    try { const result = await api<{ conversation: Conversation }>(`/api/shared/${token}/fork`, { method: 'POST' }); toast('Independent fork added to your workspace', 'success'); navigate(`/app/ai/${result.conversation.id}`); }
    catch (error: any) { toast(error.message, 'error'); setBusy(false); }
  };
  return <div className="shared-page"><header className="shared-header"><Link to="/app"><Logo /></Link><div><span><ShieldCheck size={15} />Authenticated snapshot</span><Link className="button secondary compact" to="/app"><ArrowLeft size={15} />My workspace</Link></div></header><main className="shared-main">{error ? <EmptyState title="Snapshot unavailable" description={error} action={<Link className="button secondary" to="/app">Return to workspace</Link>} /> : !shared ? <div className="center-loading page-padding"><Spinner /><span>Opening shared snapshot…</span></div> : <><div className="shared-title"><span className="shared-icon"><LockKeyhole size={22} /></span><span className="eyebrow">IMMUTABLE SHARED SNAPSHOT</span><h1>{shared.title}</h1><p>Shared {new Date(shared.createdAt).toLocaleString()} · This copy does not change when the original conversation changes.</p><div>{shared.permission === 'fork' && <button className="button primary" onClick={fork} disabled={busy}>{busy ? <Spinner /> : <GitFork size={16} />}Fork to my workspace</button>}</div></div><div className="shared-timeline">{shared.messages.map((message: Message) => <article className={`shared-message ${message.role}`} key={message.id}><div>{message.role === 'assistant' ? <span className="ai-avatar"><Bot size={17} /></span> : <Avatar name={message.senderName} color={message.avatarColor} size="sm" />}</div><div><header><strong>{message.senderName}</strong><time>{messageTime(message.createdAt)}</time>{message.status === 'partial' && <span>Partial</span>}</header><div className="message-content"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></div></div></article>)}</div><div className="shared-disclosure"><ShieldCheck size={17} /><p>This is a point-in-time copy. No future private messages, hidden prompts, or unrelated research are included.</p></div></>}</main></div>;
}
