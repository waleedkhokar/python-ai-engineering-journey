import { ArrowRight, Code2, Database, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/UI';

export default function About() {
  return <div className="about-page">
    <header className="about-header"><Link to="/" aria-label="RaoSynapse home"><Logo /></Link><nav><Link to="/">Product</Link><a href="#founder">Founder</a><a href="#developer">Developer</a><Link className="site-button site-button-small" to="/login">Enter workspace<ArrowRight size={15} /></Link></nav></header>
    <main>
      <section className="about-hero"><span className="site-kicker">ABOUT RAOSYNAPSE</span><h1>Technology should feel useful, thoughtful, and human.</h1><p>RaoSynapse is a connected workspace for thinking with AI, working with people, and turning useful ideas into work that lasts.</p></section>
      <section className="about-founder" id="founder">
        <div className="about-founder-mark">MA</div>
        <div><span className="site-kicker">FOUNDER / BUILDER</span><h2>Muhammad Abdullah</h2><p className="about-role">Founder, Software Developer & Applied AI Engineer</p><p>I work at the intersection of <strong>Artificial Intelligence, software engineering, and product development</strong>, turning ideas into practical digital solutions—from AI-powered applications and intelligent automation to data-driven systems and web platforms.</p><p>As a founder and developer, my focus goes beyond writing code. I aim to understand real business challenges, design effective solutions, and build products that are scalable, accessible, and useful.</p><p>My work includes <strong>RaoForge, Tahqiq AI, and RaoScan</strong>, reflecting my interest in AI innovation, intelligent systems, and responsible technology.</p><blockquote>Build with purpose. Solve real problems. Keep innovating.</blockquote></div>
      </section>
      <section className="about-developer" id="developer">
        <div><span className="site-kicker">DEVELOPER PLATFORM</span><h2>Build on connected context.</h2><p>RaoSynapse gives developers a durable foundation for AI conversations, collaboration, research, and product workflows.</p><Link className="site-button site-button-large" to="/login">Open developer workspace<ArrowRight size={17} /></Link></div>
        <div className="about-points"><div><Code2 size={20} /><span><b>Scoped integrations</b><small>Give each tool only the access it needs.</small></span></div><div><ShieldCheck size={20} /><span><b>Revocable by design</b><small>Manage credentials and permissions as products evolve.</small></span></div><div><Database size={20} /><span><b>Made for real work</b><small>Use versioned endpoints backed by persistent workspace data.</small></span></div></div>
      </section>
    </main>
    <footer className="about-footer"><Logo /><span>Think with AI. Build on it together.</span></footer>
  </div>;
}
