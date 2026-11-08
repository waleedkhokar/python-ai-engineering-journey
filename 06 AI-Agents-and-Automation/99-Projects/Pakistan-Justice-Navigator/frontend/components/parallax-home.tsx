"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./icons";

const stages = [
  ["01 — START WITH YOUR SITUATION", "Tell us what happened.", "Explain the problem naturally. The Legal Agent helps organise the facts and identify the legal questions hidden inside the situation."],
  ["02 — UNDERSTAND", "Discover what may apply.", "Explore potentially relevant Pakistani legal principles, legislation and procedures in language that is easier to understand."],
  ["03 — ANALYSE", "Turn documents into understanding.", "Review agreements, notices and other legal material while identifying important clauses, obligations, dates and issues that may need attention."],
  ["04 — PREPARE", "Know what to ask. Know what to prepare.", "Organise information, prepare questions and create structured notes so you are better prepared before taking your next step."],
  ["05 — MOVE FORWARD", "Legal clarity changes the conversation.", "Move forward with your facts organised, your questions prepared and a clearer understanding of your situation."]
] as const;

function IconMark({ children }: { children: ReactNode }) {
  return <span className="legal-icon">{children}</span>;
}

export function ParallaxHome() {
  const storyRef = useRef<HTMLElement | null>(null);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const story = storyRef.current;
    if (!story) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = story.getBoundingClientRect();
      const progress = Math.min(0.999, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      setStage(Math.min(stages.length - 1, Math.floor(progress * stages.length)));
      story.style.setProperty("--story-progress", progress.toFixed(3));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="landing-page">
      <section className="landing-hero" id="top">
        <div className="hero-orbit orbit-a" aria-hidden="true" />
        <div className="hero-orbit orbit-b" aria-hidden="true" />
        <div className="hero-copy">
          <span className="landing-kicker">AI LEGAL GUIDANCE</span>
          <h1>Understand the law.<br /><em>Know your next move.</em></h1>
          <p>An intelligent legal assistant designed to help you understand Pakistani law, organise your situation, analyse legal documents and prepare your next steps with greater clarity.</p>
          <div className="landing-actions">
            <Link href="/case/new" className="landing-button landing-button-dark">Start Your Case <Icon name="arrow" size={17} /></Link>
            <a href="#how-it-works" className="landing-text-link">Explore how it works <Icon name="arrow" size={15} /></a>
          </div>
        </div>
        <div className="hero-sculpture" aria-label="Bronze fist holding the scales of justice">
          <div className="sculpture-halo" aria-hidden="true" />
          <img src="/references/fist-scales.webp" alt="Bronze sculpture of a fist holding scales of justice" />
        </div>
        <aside className="hero-capability">
          <div className="capability-icons"><IconMark>◌</IconMark><IconMark>⌕</IconMark><IconMark>⌗</IconMark></div>
          <span className="landing-kicker">LEGAL AGENT</span>
          <h2>Your first point of legal understanding</h2>
          <p>Explain your situation and receive structured guidance to help you understand what may matter next.</p>
          <ul><li>Understand your situation</li><li>Explore relevant legal context</li><li>Prepare your next steps</li></ul>
        </aside>
        <div className="hero-trust"><span>PAKISTANI LEGAL CONTEXT</span><span>DOCUMENT INTELLIGENCE</span><span>STRUCTURED GUIDANCE</span></div>
      </section>

      <section className="editorial-intro landing-section" id="about">
        <div className="decor-circle circle-terracotta" aria-hidden="true" />
        <div className="decor-circle circle-mustard" aria-hidden="true" />
        <span className="landing-kicker">LEGAL INTELLIGENCE, MADE CLEAR</span>
        <div className="intro-grid"><h2>Built for the moments<br /><em>when the law feels difficult.</em></h2><p>Legal information is often fragmented, technical and difficult to interpret. The Legal Agent brings your situation, documents and relevant legal context together so you can understand the problem before deciding what to do next.</p></div>
      </section>

      <section className="capabilities landing-section" id="capabilities">
        <div className="center-heading"><span className="landing-kicker">WHAT THE LEGAL AGENT CAN DO</span><h2>One place to understand,<br /><em>analyse and prepare.</em></h2><p>Use intelligent assistance to turn complex legal information into clearer, more structured next steps.</p></div>
        <div className="capability-grid">
          <article><span className="feature-number">01</span><IconMark>◒</IconMark><span className="landing-kicker">ASK &amp; UNDERSTAND</span><h3>Explain your situation</h3><p>Describe your legal concern in ordinary language. Organise the facts, identify important questions and clarify unfamiliar concepts.</p></article>
          <article><span className="feature-number">02</span><IconMark>⌕</IconMark><span className="landing-kicker">RESEARCH</span><h3>Explore Pakistani legal context</h3><p>Discover potentially relevant legislation, legal principles and procedures without manually searching through disconnected legal material.</p></article>
          <article><span className="feature-number">03</span><IconMark>▤</IconMark><span className="landing-kicker">ANALYSE &amp; PREPARE</span><h3>Work with your documents</h3><p>Review notices, agreements and other legal material, then prepare structured notes, questions and supporting drafts.</p></article>
        </div>
        <p className="responsible-note">Designed to support legal understanding and preparation, not replace qualified professional representation.</p>
      </section>

      <section className="guidance-section landing-section" id="how-it-works">
        <div className="guidance-art"><div className="decor-circle circle-terracotta" aria-hidden="true" /><div className="decor-circle circle-mustard" aria-hidden="true" /><img src="/references/books-gavel.webp" alt="Books, scales of justice and a judge's gavel" /></div>
        <div className="guidance-copy"><span className="landing-kicker">WHEN THE LAW FEELS COMPLICATED</span><h2>You don&apos;t have to<br /><em>navigate it blindly.</em></h2><p>When a notice arrives, a contract becomes unclear or a legal problem starts getting complicated, knowing where to begin can be difficult.</p><p>The Legal Agent helps turn that uncertainty into structured information—so you can understand the situation, identify useful questions and prepare what comes next.</p><Link href="/case/new" className="landing-text-link">Ask the Legal Agent <Icon name="arrow" size={15} /></Link></div>
      </section>

      <section className="word-transition" aria-label="Legal Agent identity"><div className="word word-legal">LEGAL</div><div className="word word-agent">AGENT</div><img className="agent-globe" src="/references/legal-agent-globe.webp" alt="Vintage globe representing global legal context" /><p>Technology built to make legal information easier to understand.</p></section>

      <section ref={storyRef} className="video-story" id="story">
        <div className="video-stage"><div className="video-text">{stages.map(([label, title, body], index) => <article key={label} className={index === stage ? "story-active" : ""}><img src="/references/story-card.webp" alt="" aria-hidden="true" /><div className="story-card-content"><span>{label}</span><h2>{title}</h2><p>{body}</p>{index === stages.length - 1 && <Link href="/case/new" className="landing-button landing-button-light">Start Your Case <Icon name="arrow" size={16} /></Link>}</div></article>)}</div><div className="film-frame" aria-label="Cinematic legal story visual"><video className="story-video" autoPlay muted loop playsInline preload="metadata"><source src="/video/legal-story.mp4" type="video/mp4" /></video><div className="film-column" /><div className="film-light" /><div className="film-caption">LEGAL AGENT / PAKISTAN</div></div><div className="story-progress"><span>01</span><i style={{ transform: `scaleX(${(stage + 1) / stages.length})` }} /><span>05</span></div></div>
      </section>

      <section className="pakistan-section landing-section" id="pakistani-law"><span className="landing-kicker">BUILT AROUND PAKISTANI LEGAL CONTEXT</span><div className="pakistan-grid"><h2>Complex law.<br /><em>Clearer understanding.</em></h2><p>Pakistan&apos;s legal landscape includes legislation, procedures, legal terminology and case-specific details that can be difficult to navigate without context. The Legal Agent is designed to help organise that complexity into information that is easier to understand and work with.</p></div><div className="law-list"><div><span>01</span><strong>Pakistani legal context</strong><p>Explore legal concepts with attention to laws and procedures relevant to Pakistan.</p></div><div><span>02</span><strong>Structured research</strong><p>Move from a question to organised legal information without disconnected sources.</p></div><div><span>03</span><strong>Document intelligence</strong><p>Understand important information contained inside notices, agreements and contracts.</p></div><div><span>04</span><strong>Practical preparation</strong><p>Turn understanding into better questions, organised facts and clearer preparation.</p></div></div></section>

      <section className="responsible-section landing-section" id="responsible-ai"><div><span className="landing-kicker">RESPONSIBLE AI</span><h2>AI assistance.<br /><em>Human judgment still matters.</em></h2></div><div><p>The Legal Agent is designed to support legal understanding, research and preparation. Legal outcomes depend on the specific facts of each situation, and important decisions should be reviewed with a qualified legal professional where appropriate.</p><div className="responsible-words"><span>UNDERSTAND</span><span>PREPARE</span><span>DECIDE INFORMED</span></div></div></section>

      <section className="final-cta landing-section"><span className="landing-kicker">YOUR NEXT STEP CAN START HERE</span><h2>Start your first case.</h2><p>Describe your situation and let the Legal Agent help you organise the facts, understand the legal context and prepare what comes next.</p><Link href="/case/new" className="landing-button landing-button-dark">Start Your Case <Icon name="arrow" size={17} /></Link></section>
    </div>
  );
}
