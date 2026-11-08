import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, MessageCircle, UsersRound, FlaskConical, Plus, GitFork, Share2, Sparkles, Radio, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useRealtime } from '../lib/realtime';
import { api, json, toast } from '../lib/api';
import type { AIStatus, Conversation } from '../types';
import { EmptyState, Spinner } from '../components/UI';
import { relativeTime, truncate } from '../lib/utils';

export default function Dashboard() {
  const { user, ai } = useAuth();
  const { connected } = useRealtime();
  const navigate = useNavigate();
  const [data, setData] = useState<{ stats: any; recent: Conversation[]; ai: AIStatus } | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => { api<any>('/api/dashboard').then(setData).catch(error => toast(error.message, 'error')); }, []);
  const newAI = async () => {
    setCreating(true);
    try {
      const result = await api<{ conversation: Conversation }>('/api/conversations', { method: 'POST', body: json({ type: 'ai' }) });
      navigate(`/app/ai/${result.conversation.id}`);
    } catch (error: any) { toast(error.message, 'error'); setCreating(false); }
  };
  const open = (conversation: Conversation) => navigate(`${conversation.type === 'ai' ? '/app/ai' : conversation.type === 'room' ? '/app/rooms' : '/app/messages'}/${conversation.id}`);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  if (!data) return <div className="center-loading page-padding"><Spinner /><span>Loading your workspace…</span></div>;
  const cards = [
    { label: 'AI threads', value: data.stats.ai, icon: Bot, to: '/app/ai', color: 'violet' },
    { label: 'Unread messages', value: data.stats.messages, icon: MessageCircle, to: '/app/messages', color: 'blue' },
    { label: 'Active rooms', value: data.stats.rooms, icon: UsersRound, to: '/app/rooms', color: 'teal' },
    { label: 'Research projects', value: data.stats.research, icon: FlaskConical, to: '/app/research', color: 'amber' },
  ];
  return <div className="dashboard-page">
    <section className="dashboard-hero">
      <div className="hero-glow" />
      <div className="dashboard-hero-copy"><span className="eyebrow"><Sparkles size={13} />YOUR INTELLIGENCE WORKSPACE</span><h2>{greeting}, {user!.displayName.split(' ')[0]}.</h2><p>Pick up a thought, invite a fresh perspective, or turn your latest AI conversation into something shared.</p><div className="hero-actions"><button className="button primary" onClick={newAI} disabled={creating}>{creating ? <Spinner /> : <Plus size={17} />}New intelligence thread</button><button className="button secondary hero-person-button" onClick={() => navigate('/app/messages?new=1')}><MessageCircle size={17} />Person chat</button><button className="button secondary" onClick={() => navigate('/app/rooms')}><UsersRound size={17} />Open a room</button></div></div>
      <div className="synapse-visual" aria-hidden="true"><div className="orbit orbit-one"><i /><i /><i /></div><div className="orbit orbit-two"><i /><i /></div><span className="visual-core"><Bot size={28} /></span><span className="visual-label label-one">Ask</span><span className="visual-label label-two">Share</span><span className="visual-label label-three">Build</span></div>
    </section>

    <section className="stats-grid">{cards.map(card => <button className="stat-card" key={card.label} onClick={() => navigate(card.to)}><span className={`stat-icon ${card.color}`}><card.icon size={20} /></span><div><strong>{card.value}</strong><span>{card.label}</span></div><ArrowRight size={16} /></button>)}</section>

    <div className="dashboard-columns">
      <section className="dashboard-section recent-section">
        <div className="section-heading"><div><h3>Recent activity</h3><p>Jump back into your latest work</p></div><button className="text-button" onClick={() => navigate('/app/ai')}>View AI threads<ArrowRight size={14} /></button></div>
        {data.recent.length === 0 ? <EmptyState title="Your workspace is ready" description="Start with Synapse AI or open a real person-to-person conversation." action={<div className="empty-actions"><button className="button secondary" onClick={newAI}>Create AI thread</button><button className="button primary" onClick={() => navigate('/app/messages?new=1')}><MessageCircle size={15} />Person chat</button></div>} /> : <div className="recent-list">{data.recent.map(conversation => <button key={conversation.id} className="recent-item" onClick={() => open(conversation)}><span className={`conversation-type-icon type-${conversation.type}`}>{conversation.type === 'ai' ? <Bot size={17} /> : conversation.type === 'room' ? <UsersRound size={17} /> : <MessageCircle size={17} />}</span><div><strong>{conversation.title}</strong><p>{conversation.lastMessage ? truncate(conversation.lastMessage.content, 90) : 'No messages yet — start the timeline.'}</p></div><span className="recent-meta">{conversation.unread > 0 && <b>{conversation.unread} new</b>}<time>{relativeTime(conversation.updatedAt)}</time><ArrowRight size={15} /></span></button>)}</div>}
      </section>

      <aside className="dashboard-side">
        <section className="dashboard-section system-card"><div className="section-heading"><div><h3>System status</h3><p>Live workspace services</p></div><span className="live-indicator"><i />Operational</span></div><div className="system-list"><div><span><Radio size={16} />Realtime sync</span><strong className={connected ? 'ok' : 'warn'}>{connected ? 'Connected' : 'Reconnecting'}</strong></div><div><span><Zap size={16} />AI provider</span><strong className={ai?.configured ? 'ok' : 'warn'}>{ai?.configured ? 'Groq ready' : 'Preview mode'}</strong></div><div><span><ShieldCheck size={16} />Private storage</span><strong className="ok">Persistent</strong></div></div>{!ai?.configured && <p className="system-note">Preview responses are clearly labelled. Configure a server-side Groq key for real AI inference.</p>}</section>
        <section className="dashboard-section journey-card"><div className="section-heading"><div><h3>The Synapse flow</h3><p>From isolated chat to shared progress</p></div></div><div className="mini-journey"><div><span><Bot size={15} /></span><strong>Ask</strong><small>Investigate privately</small></div><i /><div><span><Share2 size={15} /></span><strong>Connect</strong><small>Share or invite</small></div><i /><div><span><GitFork size={15} /></span><strong>Build</strong><small>Fork independently</small></div></div></section>
      </aside>
    </div>
  </div>;
}
