"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listCases } from "@/lib/case-store";
import { listDrafts } from "@/lib/draft-store";
import { LIBRARY_TOTAL, libraryByType } from "@/lib/justice-regions";
import type { CaseDraft } from "@/lib/types";
import { EmptyState, Notice, formatDate } from "./app-ui";
import { Icon, type IconName } from "./icons";
import { JusticeMap } from "./justice-map";

type DemoUser = { name: string; email: string; mode: "demo" };

const TOOLS: { href: string; icon: IconName; title: string; body: string }[] = [
  { href: "/research", icon: "search", title: "Legal Research", body: "Search official-source records by topic." },
  { href: "/briefs", icon: "brief", title: "Case Brief", body: "Structured summaries of your saved cases." },
  { href: "/drafting", icon: "edit", title: "Draft Documents", body: "Fill a template, review, then export." },
  { href: "/sources", icon: "library", title: "Source Library", body: "Browse the official sources behind answers." }
];

export function DashboardClient() {
  const [cases, setCases] = useState<CaseDraft[] | null>(null);
  const [drafts, setDrafts] = useState(0);
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    void listCases().then(setCases);
    setDrafts(listDrafts().length);
    try {
      setUser(JSON.parse(window.localStorage.getItem("pjn:demo-user:v1") ?? "null") as DemoUser | null);
    } catch {
      setUser(null);
    }
  }, []);

  const stats = useMemo(() => {
    const list = cases ?? [];
    return { total: list.length, docs: list.reduce((sum, item) => sum + item.documents.length, 0) };
  }, [cases]);

  const byType = useMemo(() => libraryByType(), []);
  const max = Math.max(...byType.map((item) => item.value), 1);

  const cards = [
    { label: "Saved cases", value: cases === null ? "…" : String(stats.total), note: "stored in this browser", icon: "brief" as IconName },
    { label: "Attached documents", value: cases === null ? "…" : String(stats.docs), note: "across your cases", icon: "document" as IconName },
    { label: "Saved drafts", value: String(drafts), note: "from Draft Documents", icon: "edit" as IconName },
    { label: "Official sources", value: String(LIBRARY_TOTAL), note: "in the source library", icon: "library" as IconName }
  ];

  return (
    <div className="app-page">
      <header className="app-pagehead">
        <div>
          <span className="app-eyebrow">Dashboard</span>
          <h1>{user?.name ? `Welcome back, ${user.name}.` : "Welcome to your workspace."}</h1>
          <p>Start a legal query, continue a saved case, or inspect the official sources behind your brief.</p>
        </div>
        <Link href="/case/new" className="app-btn app-btn-primary"><Icon name="plus" size={18} /> New query</Link>
      </header>

      <section className="app-stats" aria-label="Summary">
        {cards.map((card) => (
          <div className="app-stat" key={card.label}>
            <span className="app-stat-icon"><Icon name={card.icon} size={18} /></span>
            <small>{card.label}</small>
            <strong>{card.value}</strong>
            <em>{card.note}</em>
          </div>
        ))}
      </section>

      <section className="app-grid-2">
        <div className="app-card">
          <div className="app-card-head"><h2>Tools</h2></div>
          <div className="app-tools">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="app-tool">
                <span><Icon name={tool.icon} size={20} /></span>
                <div><strong>{tool.title}</strong><small>{tool.body}</small></div>
                <Icon name="arrow" size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="app-card">
          <div className="app-card-head"><h2>Recent cases</h2><Link href="/briefs">View all →</Link></div>
          {cases === null ? (
            <div className="app-skeleton"><div /><div /></div>
          ) : cases.length === 0 ? (
            <EmptyState icon="scale" title="No saved cases yet" body="Describe your situation in your own words and your first case brief will appear here." href="/case/new" cta="Start your first case" />
          ) : (
            <ul className="app-list">
              {cases.slice(0, 4).map((item) => (
                <li key={item.caseId}>
                  <Link href={`/case/${item.caseId}`}>
                    <span className="app-list-icon"><Icon name="brief" size={16} /></span>
                    <div><strong>{item.triage.category}</strong><small>{item.caseId} · {formatDate(item.updatedAt)}</small></div>
                    <Icon name="arrow" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="app-grid-2 app-grid-map">
        <div className="app-card">
          <div className="app-card-head"><h2>Courts &amp; regions</h2><Link href="/map">Full map →</Link></div>
          <JusticeMap compact />
        </div>
        <div className="app-card">
          <div className="app-card-head"><h2>Source library by type</h2><Link href="/sources">Browse →</Link></div>
          <ul className="app-bars" aria-label="Number of official sources by document type">
            {byType.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <div className="app-bar"><i style={{ width: `${(item.value / max) * 100}%` }} /></div>
                <b>{item.value}</b>
              </li>
            ))}
          </ul>
          <p className="app-fine">Counts come from this project&apos;s source records, not from live court data.</p>
        </div>
      </section>

      <Notice>Pakistan Justice Navigator provides information to help you prepare. It is not legal advice, and AI-generated text is never a substitute for a qualified lawyer or the official source.</Notice>
    </div>
  );
}
