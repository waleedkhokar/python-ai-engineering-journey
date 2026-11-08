import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowUp, ArrowUpRight, Bot, Check, CheckCircle2, ChevronRight, Code2,
  Database, FileText, FlaskConical, GitFork, LockKeyhole, Menu,
  MessageCircle, Network, Plus, ShieldCheck, Sparkles, UsersRound, X,
} from 'lucide-react';
import { Logo } from '../components/UI';
import { useAuth } from '../lib/auth';
import { saveChatDraft } from '../lib/draft';

const showcases = [
  {
    id: 'people', label: 'Person chat', icon: MessageCircle,
    title: 'A real conversation with a real person.',
    description: 'Find someone by username, review their profile, write an opening message, and keep a persistent direct timeline with live presence and read receipts.',
    points: ['Direct person-to-person messaging', 'Realtime presence, delivery, and read states', 'Persistent private history across devices'],
  },
  {
    id: 'ai', label: 'Synapse AI', icon: Bot,
    title: 'Think privately. Keep the useful context.',
    description: 'Persistent conversations, streamed responses, clear completion states, and a record you can return to.',
    points: ['Private by default', 'Reconnect-safe conversation history', 'Honest provider and preview labels'],
  },
  {
    id: 'rooms', label: 'Rooms', icon: UsersRound,
    title: 'Bring people and AI into the same room.',
    description: 'Invite collaborators, define roles, and ask AI from shared context without exposing private threads.',
    points: ['Owner, editor, and viewer roles', 'Realtime messages and presence', 'Room-scoped AI context'],
  },
  {
    id: 'research', label: 'Research', icon: FlaskConical,
    title: 'Keep the evidence beside the thinking.',
    description: 'Organize sources and notes, preserve supplied provenance, and export your work without invented citations.',
    points: ['Source-level metadata and notes', 'Clear user-supplied provenance', 'Portable Markdown exports'],
  },
] as const;

type ShowcaseKey = typeof showcases[number]['id'];

export default function Landing() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<ShowcaseKey>('people');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  }, [location.hash]);

  const startChat = () => {
    const draft = prompt.trim();
    if (!draft) { promptRef.current?.focus(); return; }
    saveChatDraft(draft);
    navigate('/login?from=chat');
  };

  const choosePrompt = (value: string) => {
    setPrompt(value);
    requestAnimationFrame(() => promptRef.current?.focus());
  };

  if (!loading && user) return <Navigate to="/app" replace />;
  const closeMenu = () => setMenuOpen(false);

  return <div className="site-shell">
    <header className="site-nav">
      <div className="site-container site-nav-inner">
        <Link to="/" aria-label="RaoSynapse home" onClick={closeMenu}><Logo /></Link>
        <nav className="site-nav-links" aria-label="Main navigation">
          <a href="#chat">AI chat</a><Link to="/login?from=people">Person chat</Link><a href="#product">Product</a><Link to="/about">About</Link><a href="#developer">Developer</a><a href="#faq">FAQ</a>
        </nav>
        <div className="site-nav-actions"><Link className="site-button site-button-small" to="/login">Enter workspace<ArrowUpRight size={15} /></Link></div>
        <button className="site-menu-button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-mobile-menu" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {menuOpen && <nav id="site-mobile-menu" className="site-mobile-menu" aria-label="Mobile navigation">
        <a href="#chat" onClick={closeMenu}>AI chat<ChevronRight size={16} /></a><Link to="/login?from=people" onClick={closeMenu}>Person chat<ChevronRight size={16} /></Link><a href="#product" onClick={closeMenu}>Product<ChevronRight size={16} /></a><Link to="/about" onClick={closeMenu}>About<ChevronRight size={16} /></Link><a href="#developer" onClick={closeMenu}>Developer<ChevronRight size={16} /></a><a href="#faq" onClick={closeMenu}>FAQ<ChevronRight size={16} /></a>
        <div><Link className="site-button" to="/login" onClick={closeMenu}>Enter workspace<ArrowRight size={16} /></Link></div>
      </nav>}
    </header>

    <main>
      <section className="chat-hero" id="chat">
        <div className="site-container chat-hero-inner">
          <div className="chat-hero-heading">
            <span className="site-eyebrow"><i />RAOSYNAPSE / YOUR CONNECTED AI WORKSPACE</span>
            <h1>What do you want to <em>think through?</em></h1>
            <p>Start with a question. Keep the conversation, add research, invite people, and build on the answer when you are ready.</p>
          </div>
          <form className="chat-launcher" onSubmit={event => { event.preventDefault(); startChat(); }}>
            <div className="chat-launcher-top"><span><Bot size={16} />Synapse AI</span><span><LockKeyhole size={13} />Private by default</span></div>
            <textarea ref={promptRef} value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); startChat(); } }} rows={3} maxLength={12000} aria-label="Ask RaoSynapse anything" placeholder="Ask a question, explore an idea, or start a plan…" autoFocus />
            <div className="chat-launcher-bottom"><span>{prompt.length > 0 ? `${prompt.length.toLocaleString()} characters · Enter to continue` : 'Your prompt stays with you when you enter.'}</span><button type="submit" disabled={!prompt.trim()} aria-label="Start chatting"><span>Start chatting</span><ArrowUp size={18} /></button></div>
          </form>
          <Link className="hero-person-chat" to="/login?from=people"><span className="hero-person-icon"><MessageCircle size={20} /></span><div><b>Want to talk to a real person?</b><small>Open direct messaging with live presence, persistent history, and read receipts.</small></div><strong>Open person chat<ArrowRight size={16} /></strong></Link>
          <div className="chat-prompt-suggestions"><span>OR START WITH AN IDEA</span><div>
            <button type="button" onClick={() => choosePrompt('Build a research plan for responsible AI adoption in a small team.')}><FlaskConical size={16} /><span>Plan a research project</span><ArrowUpRight size={14} /></button>
            <button type="button" onClick={() => choosePrompt('Compare two product directions and help me evaluate the trade-offs.')}><Network size={16} /><span>Compare two directions</span><ArrowUpRight size={14} /></button>
            <button type="button" onClick={() => choosePrompt('Help me turn a rough idea into a structured project plan.')}><Sparkles size={16} /><span>Shape a rough idea</span><ArrowUpRight size={14} /></button>
          </div></div>
          <div className="chat-hero-assurances"><span><Check size={14} />No credit card</span><span><Check size={14} />Persistent conversation history</span><span><Check size={14} />Nothing is sent before you continue</span></div>
        </div>
        <div className="site-container site-capability-strip" aria-label="Core capabilities">
          <span>Chat first. Connect more when you need it.</span>
          <div><b><MessageCircle size={15} />People</b><b><Bot size={15} />AI</b><b><UsersRound size={15} />Rooms</b><b><FlaskConical size={15} />Research</b><b><Code2 size={15} />API</b></div>
        </div>
      </section>

      <section className="site-section site-product" id="product">
        <div className="site-container">
          <div className="site-section-heading"><div><span className="site-kicker">PRODUCT TOUR</span><h2>Less tool switching.<br />More connected thinking.</h2></div><p>Each part of RaoSynapse is built around the same persistent workspace, so a useful idea can become a conversation, a shared decision, or a body of evidence.</p></div>
          <div className="site-showcase">
            <div className="site-showcase-tabs" role="tablist" aria-label="Product capabilities">
              {showcases.map(item => { const Icon = item.icon; return <button key={item.id} id={`showcase-tab-${item.id}`} role="tab" aria-selected={active === item.id} aria-controls={`showcase-panel-${item.id}`} tabIndex={active === item.id ? 0 : -1} className={active === item.id ? 'active' : ''} onClick={() => setActive(item.id)} onKeyDown={event => {
                if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
                event.preventDefault();
                const direction = event.key === 'ArrowRight' ? 1 : -1;
                const index = showcases.findIndex(entry => entry.id === active);
                const next = showcases[(index + direction + showcases.length) % showcases.length].id;
                setActive(next);
                requestAnimationFrame(() => document.getElementById(`showcase-tab-${next}`)?.focus());
              }}><Icon size={18} /><span>{item.label}</span><ChevronRight size={16} /></button>; })}
            </div>
            {showcases.map(item => active === item.id && <div className="site-showcase-panel" id={`showcase-panel-${item.id}`} role="tabpanel" aria-labelledby={`showcase-tab-${item.id}`} key={item.id}>
              <div className="site-showcase-copy"><span className="site-kicker">{item.label.toUpperCase()}</span><h3>{item.title}</h3><p>{item.description}</p><ul>{item.points.map(point => <li key={point}><CheckCircle2 size={16} />{point}</li>)}</ul><Link to={active === 'people' ? '/login?from=people' : '/login'}>{active === 'people' ? 'Open real person chat' : 'Try it in the live workspace'}<ArrowRight size={16} /></Link></div>
              <ShowcaseVisual active={active} />
            </div>)}
          </div>
        </div>
      </section>

      <section className="site-workflow" id="workflow">
        <div className="site-container">
          <div className="site-section-heading site-heading-light"><div><span className="site-kicker">A PRACTICAL WORKFLOW</span><h2>Your work keeps its context<br />at every step.</h2></div><p>No exporting a chat just to make it useful somewhere else. Move forward while the original record stays intact.</p></div>
          <div className="site-steps">
            <article><span>01</span><div className="site-step-icon"><Bot size={21} /></div><h3>Investigate</h3><p>Start with a private AI thread. Ask, iterate, and keep the useful turns.</p><small>Persistent AI conversations</small></article>
            <article><span>02</span><div className="site-step-icon"><ShareIcon /></div><h3>Connect</h3><p>Share an immutable snapshot or invite the right people into a Room.</p><small>Controlled sharing and roles</small></article>
            <article><span>03</span><div className="site-step-icon"><GitFork size={21} /></div><h3>Build onward</h3><p>Fork a promising direction, attach research, and keep the original untouched.</p><small>Independent forks and evidence</small></article>
          </div>
        </div>
      </section>

      <section className="site-section" id="security">
        <div className="site-container site-split">
          <div className="site-split-copy"><span className="site-kicker">CONTROL & PROVENANCE</span><h2>Professional work needs more than a good answer.</h2><p>RaoSynapse makes access, origin, and response state visible. Private conversations are access-controlled, sharing is explicit, and source metadata is never presented as independently verified when it is not.</p><Link className="site-inline-link" to="/login">Choose a username<ArrowRight size={16} /></Link></div>
          <div className="site-control-list">
            <div><span><LockKeyhole size={19} /></span><div><h3>Private by default</h3><p>Authentication and authorization are enforced on the server.</p></div></div>
            <div><span><ShieldCheck size={19} /></span><div><h3>Revocable access</h3><p>Sessions, share links, room memberships, and API tokens can be controlled.</p></div></div>
            <div><span><FileText size={19} /></span><div><h3>Honest research records</h3><p>User-supplied source metadata remains labelled as user-supplied.</p></div></div>
            <div><span><Database size={19} /></span><div><h3>Durable workspace state</h3><p>Conversations, messages, research, and settings survive restarts.</p></div></div>
          </div>
        </div>
      </section>

      <section className="site-section founder-section" id="about">
        <div className="site-container founder-grid">
          <div className="founder-intro"><span className="site-kicker">ABOUT RAOSYNAPSE</span><h2>Technology should feel useful, thoughtful, and human.</h2><p>RaoSynapse is built for the space between an idea and the work it becomes: a place to think with AI, involve people, preserve evidence, and move forward with context intact.</p><Link className="site-inline-link" to="/login">Explore the workspace<ArrowRight size={16} /></Link></div>
          <div className="founder-card"><div className="founder-mark">MA</div><div><span className="site-kicker">FOUNDER / BUILDER</span><h3>Muhammad Abdullah</h3><p className="founder-role">Founder, Software Developer & Applied AI Engineer</p><p>I work at the intersection of artificial intelligence, software engineering, and product development, turning ideas into practical digital solutions—from AI-powered applications and intelligent automation to data-driven systems and web platforms.</p><p>My work includes <strong>RaoForge, Tahqiq AI, and RaoScan</strong>. I build with a long-term vision: meaningful technology, responsible innovation, and products that help people and businesses move forward.</p><blockquote>Build with purpose. Solve real problems. Keep innovating.</blockquote></div></div>
        </div>
      </section>

      <section className="site-section developer-section" id="developer">
        <div className="site-container developer-story">
          <div><span className="site-kicker">DEVELOPER PLATFORM</span><h2>Build on a workspace that keeps its context.</h2><p>Connect your tools to conversations, people, rooms, and research through a focused API. Create scoped credentials, make safe retries, and revoke access whenever you need to.</p><Link className="site-button site-button-large" to="/login">Open developer workspace<ArrowRight size={17} /></Link></div>
          <div className="developer-points"><div><Code2 size={20} /><span><b>Scoped by design</b><small>Grant only the permissions an integration needs.</small></span></div><div><ShieldCheck size={20} /><span><b>Safe to operate</b><small>Hashed tokens, explicit scopes, and revocable access.</small></span></div><div><Database size={20} /><span><b>Built for real products</b><small>Versioned JSON endpoints for durable workflows.</small></span></div></div>
        </div>
      </section>

      <section className="site-section site-faq" id="faq">
        <div className="site-container site-faq-grid">        <div><span className="site-kicker">COMMON QUESTIONS</span><h2>A clearer way to understand the workspace.</h2><p>Choose a username and start using the actual product workflows.</p></div><div className="site-faq-list">
          <details><summary>Can I use RaoSynapse without configuring an AI key?<Plus size={18} /></summary><p>Yes. The workspace and its collaboration features work without a paid API. If an AI provider is not configured, the response state is clearly explained instead of being presented as something it is not.</p></details>
          <details><summary>What happens when I share a conversation?<Plus size={18} /></summary><p>You create a snapshot of a specific moment. Future private messages are not added to it. Depending on the sharing choice, recipients can view or fork that snapshot.</p></details>
          <details><summary>Are private conversations end-to-end encrypted?<Plus size={18} /></summary><p>No. They are access-controlled on the server, not end-to-end encrypted. RaoSynapse makes that distinction explicit rather than overstating privacy.</p></details>
          <details><summary>Can I build an integration?<Plus size={18} /></summary><p>Yes. Developer settings provide scoped, hashed, revocable API tokens and versioned JSON endpoints for the operations allowed by each token.</p></details>
        </div></div>
      </section>

      <section className="site-cta"><div className="site-container site-cta-inner"><div><span className="site-kicker">PEOPLE AND IDEAS, CONNECTED</span><h2>Start with a person or a question.</h2><p>Choose a unique username and display name. No password or separate registration flow.</p></div><div><Link className="site-button site-button-large" to="/login">Enter workspace<ArrowRight size={18} /></Link><Link to="/login?from=people">Open person chat<ArrowUpRight size={16} /></Link></div></div></section>
    </main>

    <footer className="site-footer"><div className="site-container">
      <div className="site-footer-grid"><div className="site-footer-brand"><Link to="/"><Logo /></Link><p>Think with AI. Build on it together.</p><span><i />A workspace for useful work</span></div>
        <FooterColumn title="Product" links={[['Person chat', '/login?from=people'], ['Synapse AI', '/login'], ['Rooms & messaging', '/login'], ['Research', '/login'], ['Snapshots & forks', '/login']]} />
        <FooterColumn title="Explore" links={[['Chat first', '#chat'], ['Product tour', '#product'], ['Workflow', '#workflow'], ['Security & provenance', '#security'], ['Developer API', '/login']]} />
        <FooterColumn title="Workspace" links={[['Enter workspace', '/login'], ['Open person chat', '/login?from=people'], ['Common questions', '#faq']]} />
      </div>
      <div className="site-footer-bottom"><span>© {new Date().getFullYear()} RaoSynapse. Built for connected work.</span><div><a href="#security">Privacy approach</a><Link to="/login">Developer API</Link><a href="#faq">FAQ</a></div></div>
    </div></footer>
  </div>;
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div className="site-footer-column"><h3>{title}</h3>{links.map(([label, to]) => to.startsWith('#') ? <a key={label} href={to}>{label}</a> : <Link key={label} to={to}>{label}</Link>)}</div>;
}

function ShowcaseVisual({ active }: { active: ShowcaseKey }) {
  if (active === 'people') return <div className="site-demo-canvas site-person-canvas"><div className="site-demo-toolbar"><span><MessageCircle size={15} />Person chat</span><b className="site-person-online"><i />LIVE PRESENCE</b></div><div className="site-person-profile"><span>SC</span><div><b>Sam Chen</b><small>@sam · Research, design, and useful technology</small></div><em>Direct</em></div><div className="site-person-messages"><div className="site-person-message"><b>Sam Chen</b><p>Hey — did you get a chance to look at the research notes?</p></div><div className="site-person-message own"><b>You</b><p>Yes. Let’s compare the two directions here and keep the context together.</p><small><CheckCircle2 size={12} />Read</small></div></div><div className="site-demo-compose"><Plus size={14} />Write a private message…<span className="site-demo-send" aria-hidden="true"><ArrowUpRight size={14} /></span></div></div>;
  if (active === 'rooms') return <div className="site-demo-canvas"><div className="site-demo-toolbar"><span><UsersRound size={15} />Collaborative AI Lab</span><b>3 MEMBERS</b></div><div className="site-room-members"><span>AR</span><span>SC</span><span>+</span><small>Shared context, clear roles</small></div><div className="site-demo-message"><b>Sam</b><p>I added the source notes. Can we compare the two approaches?</p></div><div className="site-demo-message site-demo-ai"><b><Bot size={13} />Synapse AI <i>ROOM CONTEXT</i></b><p>Using only this Room’s shared timeline, here is a practical comparison…</p></div><div className="site-demo-compose"><Plus size={14} />Contribute to the Room…<span className="site-demo-send" aria-hidden="true"><ArrowUpRight size={14} /></span></div></div>;
  if (active === 'research') return <div className="site-demo-canvas"><div className="site-demo-toolbar"><span><FlaskConical size={15} />Responsible AI notes</span><b>RESEARCH PROJECT</b></div><div className="site-source-card"><span>NIST</span><div><b>AI Risk Management Framework</b><small>User-supplied source metadata</small><p>Notes, access date, publisher, and original URL stay together.</p></div><ArrowUpRight size={16} /></div><div className="site-source-card"><span>NOTE</span><div><b>Evaluation checklist</b><small>Project note</small><p>Capture what still needs verification before citing.</p></div><FileText size={16} /></div><div className="site-export-row"><span><CheckCircle2 size={15} />Provenance remains visible</span><b><FileText size={14} />Markdown export</b></div></div>;
  return <div className="site-demo-canvas"><div className="site-demo-toolbar"><span><Bot size={15} />Private AI thread</span><b>AUTOSAVED</b></div><div className="site-demo-message"><b>You</b><p>Help me turn these findings into a research plan.</p></div><div className="site-demo-message site-demo-ai"><b><Sparkles size={13} />Synapse AI <i>LIVE RESPONSE</i></b><p>Here’s a structured plan. Your conversation is persisted as the response develops.</p><div className="site-ai-lines"><i /><i /><i /></div></div><div className="site-response-state"><span><CheckCircle2 size={14} />Response completed</span><small>Provider state stays visible</small></div></div>;
}

function ShareIcon() {
  return <Network size={21} />;
}
