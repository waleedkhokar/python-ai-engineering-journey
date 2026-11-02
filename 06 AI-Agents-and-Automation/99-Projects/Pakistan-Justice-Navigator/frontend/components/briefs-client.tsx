"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listCases } from "@/lib/case-store";
import type { CaseDraft } from "@/lib/types";
import { EmptyState, Notice, PageHeader, formatDate } from "./app-ui";
import { Icon } from "./icons";

export function BriefsClient() {
  const [cases, setCases] = useState<CaseDraft[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    listCases().then(setCases).catch(() => { setFailed(true); setCases([]); });
  }, []);

  return (
    <div className="app-page">
      <PageHeader
        eyebrow="Case Brief"
        title="Your case briefs"
        lede="Each brief separates what you told us, the AI-generated organisation of it, and the official sources attached to it."
        action={<Link href="/case/new" className="app-btn app-btn-primary"><Icon name="plus" size={18} /> New query</Link>}
      />

      {failed && <Notice>Saved cases could not be loaded just now. Your data has not been changed.</Notice>}

      {cases === null ? (
        <div className="app-skeleton"><div /><div /><div /></div>
      ) : cases.length === 0 ? (
        <div className="app-card"><EmptyState icon="brief" title="No case briefs yet" body="Briefs are created from the guided intake. Describe what happened in English, Urdu or Roman Urdu." href="/case/new" cta="Start a case" /></div>
      ) : (
        <div className="app-brief-grid">
          {cases.map((item) => (
            <Link key={item.caseId} href={`/case/${item.caseId}`} className="app-card app-brief">
              <div className="app-brief-top">
                <span className={`app-badge urgency-${item.triage.urgency}`}>{item.triage.urgency} urgency</span>
                <small>{item.caseId} · {formatDate(item.updatedAt)}</small>
              </div>
              <h3>{item.triage.category}</h3>
              <p>{item.triage.summary}</p>
              <ul className="app-brief-meta">
                <li>{item.triage.legalIssues.length} key issues</li>
                <li>{item.triage.sourceIds.length} sources</li>
                <li>{item.documents.length} documents</li>
              </ul>
              <span className="app-brief-open">Open brief <Icon name="arrow" size={15} /></span>
            </Link>
          ))}
        </div>
      )}

      <Notice tone="green">Summaries are AI-assisted organisation of your own account, not findings of law. Source links point to official material for you to read yourself.</Notice>
    </div>
  );
}
