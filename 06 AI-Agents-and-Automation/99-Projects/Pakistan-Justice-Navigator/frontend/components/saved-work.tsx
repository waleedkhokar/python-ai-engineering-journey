"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listCases } from "@/lib/case-store";
import { deleteDraft, listDrafts, type SavedDraft } from "@/lib/draft-store";
import type { CaseDraft } from "@/lib/types";
import { EmptyState, PageHeader, formatDate } from "./app-ui";
import { Icon } from "./icons";

export function SavedWork() {
  const [cases, setCases] = useState<CaseDraft[] | null>(null);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);

  useEffect(() => {
    listCases().then(setCases).catch(() => setCases([]));
    setDrafts(listDrafts());
  }, []);

  return (
    <div className="app-page">
      <PageHeader eyebrow="Saved Work" title="Everything you have saved" lede="Case briefs and document drafts stored in this browser. Nothing here is shared." />

      <section className="app-grid-2">
        <div className="app-card">
          <div className="app-card-head"><h2>Case briefs</h2><Link href="/briefs">Open →</Link></div>
          {cases === null ? <div className="app-skeleton"><div /></div> : cases.length === 0 ? (
            <EmptyState icon="brief" title="No cases saved" body="Your briefs will be listed here." href="/case/new" cta="Start a case" />
          ) : (
            <ul className="app-list">
              {cases.map((item) => (
                <li key={item.caseId}><Link href={`/case/${item.caseId}`}><span className="app-list-icon"><Icon name="brief" size={16} /></span><div><strong>{item.triage.category}</strong><small>{item.caseId} · {formatDate(item.updatedAt)}</small></div><Icon name="arrow" size={16} /></Link></li>
              ))}
            </ul>
          )}
        </div>
        <div className="app-card">
          <div className="app-card-head"><h2>Document drafts</h2><Link href="/drafting">Open →</Link></div>
          {drafts.length === 0 ? (
            <EmptyState icon="edit" title="No drafts saved" body="Save a draft from Draft Documents to find it here." href="/drafting" cta="Draft a document" />
          ) : (
            <ul className="app-list">
              {drafts.map((draft) => (
                <li key={draft.id} className="app-list-row">
                  <Link href="/drafting"><span className="app-list-icon"><Icon name="document" size={16} /></span><div><strong>{draft.title}</strong><small>{draft.id} · {formatDate(draft.updatedAt)}</small></div></Link>
                  <button type="button" className="app-icon-btn" aria-label={`Delete draft ${draft.id}`} onClick={() => setDrafts(deleteDraft(draft.id))}><Icon name="close" size={14} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
