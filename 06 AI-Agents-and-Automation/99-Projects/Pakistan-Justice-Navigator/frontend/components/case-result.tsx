"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { loadCase } from "@/lib/case-store";
import type { CaseDraft, LegalDocumentMeta } from "@/lib/types";
import { Icon } from "./icons";
import { Reveal } from "./reveal";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export function CaseResult({ sourceMap, caseId }: { sourceMap: Record<string, LegalDocumentMeta>; caseId: string }) {
  const [draft, setDraft] = useState<CaseDraft | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    void loadCase(caseId).then(setDraft);
  }, [caseId]);

  const sources = useMemo(() => {
    if (!draft) return [];
    return draft.triage.sourceIds.map((id) => sourceMap[id]).filter((source): source is LegalDocumentMeta => Boolean(source) && !source.title.toLowerCase().includes("placeholder"));
  }, [draft, sourceMap]);

  async function copyReference() {
    if (!draft) return;
    await navigator.clipboard.writeText(draft.caseId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (draft === undefined) return <div className="loading-card surface-card"><span className="loading-line" /> <span className="loading-line short" /> <p>Preparing your saved brief —</p></div>;

  if (draft === null) {
    return (
      <div className="missing-case depth-card">
        <span className="empty-icon"><Icon name="document" size={30} /></span>
        <span className="eyebrow">CASE NOT FOUND —</span>
        <h1>We couldn’t find this case in your saved drafts.</h1>
        <p>No example case has been substituted. Start a new case or return to your case list.</p>
        <div className="hero-actions"><Link href="/case/new" className="button button-accent">Start new case</Link><Link href="/dashboard" className="button button-quiet">My cases</Link></div>
      </div>
    );
  }

  const analyzedDocuments = draft.documents.filter((file) => file.status === "analyzed").length;

  return (
    <div className="result-shell">
      <Reveal className="result-heading">
        <div>
          <span className="eyebrow">CASE {draft.caseId} — PREPARED {formatDate(draft.createdAt)}</span>
          <h1>{draft.triage.category}</h1>
          <p className="lede">A reviewable brief that keeps your statements, AI organization, document status and source context visibly separate.</p>
        </div>
        <div className="result-actions"><button className="button button-quiet" type="button" onClick={copyReference}>{copied ? "Copied" : "Copy case reference"}</button><button className="button button-dark" type="button" onClick={() => window.print()}>Print / save brief</button></div>
      </Reveal>

      <Reveal className="brief-summary" delay={50}>
        <div className="summary-mark"><Icon name="scale" size={25} /></div>
        <div><span className="section-kicker">— WHAT WE UNDERSTOOD</span><h2>{draft.triage.summary}</h2><p>This is a preliminary organization of the information provided. It is not a final legal conclusion.</p></div>
        <div className={`review-priority priority-${draft.triage.urgency}`}><strong>{draft.triage.urgency}</strong><span>review priority</span><small>Workflow signal — not a verified legal urgency.</small></div>
      </Reveal>

      <div className="provenance-key" aria-label="Information status legend">
        <span className="provenance-pill reported">YOU REPORTED</span>
        <span className="provenance-pill review">AI ORGANIZED</span>
        <span className="provenance-pill source">SOURCE TO VERIFY</span>
        <span className="provenance-pill verified">VERIFIED EVIDENCE</span>
      </div>

      <div className="result-grid">
        <section className="result-main">
          <Reveal>
            <article className="surface-card result-card">
              <span className="section-kicker">— 01 / YOUR ACCOUNT</span>
              <span className="provenance-pill reported">YOU REPORTED</span>
              <p className="quote-story">{draft.description}</p>
              <div className="fact-row"><span><Icon name="message" size={17} /> Citizen statement</span><span>{Object.keys(draft.answers).length} clarification{Object.keys(draft.answers).length === 1 ? "" : "s"}</span><span>{draft.documents.length} file{draft.documents.length === 1 ? "" : "s"} selected</span></div>
            </article>
          </Reveal>

          {Object.keys(draft.answers).length > 0 && <Reveal><article className="surface-card result-card"><span className="section-kicker">— 02 / CLARIFICATIONS</span><span className="provenance-pill reported">YOU REPORTED</span><div className="answer-ledger">{Object.entries(draft.answers).map(([id, answer], index) => <div key={id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{answer}</strong></div>)}</div></article></Reveal>}

          <Reveal>
            <article className="surface-card result-card">
              <span className="section-kicker">— 03 / POINTS TO REVIEW</span>
              <span className="provenance-pill review">AI ORGANIZED</span>
              <div className="issue-list">{draft.triage.legalIssues.map((issue, index) => <div className="issue" key={issue}><span>{String(index + 1).padStart(2, "0")}</span><strong>{issue}</strong></div>)}</div>
              <p className="card-footnote">These are review topics, not findings that a law definitely applies.</p>
            </article>
          </Reveal>

          <Reveal>
            <article className="surface-card result-card">
              <span className="section-kicker">— 04 / WHAT STILL NEEDS CHECKING</span>
              <ul className="checklist">{draft.triage.missingInformation.map((item) => <li key={item}><span>○</span>{item}</li>)}</ul>
            </article>
          </Reveal>

          <Reveal>
            <article className="surface-card result-card">
              <span className="section-kicker">— 05 / DOCUMENT STATUS</span>
              {draft.documents.length === 0 ? <div className="empty-inline">No documents were attached. You can still use this brief to collect the right material later.</div> : <div className="file-list">{draft.documents.map((file) => <div className="file-row" key={`${file.name}-${file.size}`}><span className="file-icon"><Icon name="document" size={18} /></span><div><strong>{file.name}</strong><small>{file.status === "analyzed" ? "Document analysis confirmed" : "File listed in the case — content not yet verified"}</small></div><span className={file.status === "analyzed" ? "status" : "status status-neutral"}>{file.status === "analyzed" ? "Analyzed" : "Not analyzed"}</span></div>)}</div>}
              {analyzedDocuments === 0 && draft.documents.length > 0 && <p className="card-footnote">No document-derived fact is treated as verified yet.</p>}
            </article>
          </Reveal>

          <Reveal>
            <article className="next-steps-card depth-card">
              <span className="section-kicker">— 06 / PRACTICAL NEXT STEPS</span>
              <h2>Use this brief to make the next conversation more focused.</h2>
              <ol>
                <li><span>01</span><div><strong>Fill the missing information</strong><p>Collect the facts listed above before relying on the brief.</p></div></li>
                <li><span>02</span><div><strong>Verify important documents and dates</strong><p>Especially notices, orders, ownership records and any possible deadline.</p></div></li>
                <li><span>03</span><div><strong>Inspect the original sources</strong><p>Possible source titles are linked separately and should not be treated as case-specific citations until verified.</p></div></li>
                <li><span>04</span><div><strong>Take the brief to a qualified professional where needed</strong><p>The organized chronology and questions can reduce time spent re-explaining the matter.</p></div></li>
              </ol>
            </article>
          </Reveal>
        </section>

        <aside className="result-aside">
          <Reveal>
            <article className="source-stack depth-card">
              <span className="section-kicker">POSSIBLE OFFICIAL SOURCES —</span>
              <p>These official titles may be relevant to review. Exact sections and applicability are not claimed here unless the retrieval layer confirms them.</p>
              {sources.length === 0 ? <div className="empty-inline dark">No official source title has been matched yet.</div> : sources.map((source) => <a className="source-mini" href={source.source_url} target="_blank" rel="noreferrer" key={source.document_id}><span className="source-code"><Icon name="book" size={17} /></span><div><strong>{source.title}</strong><small>{source.authority} — {source.jurisdiction}</small><em>Official title linked · relevance pending</em></div><Icon name="external" size={16} /></a>)}
              <Link className="text-link" href="/sources">Browse official source directory <Icon name="arrow" size={16} /></Link>
            </article>
          </Reveal>

          <Reveal>
            <article className="guardrail-card surface-card"><Icon name="shield" size={27} /><div><strong>Important boundary —</strong><p>{draft.triage.guardrail}</p></div></article>
          </Reveal>

          <Reveal>
            <article className="consult-card">
              <span>READY FOR REVIEW —</span>
              <h3>Take a cleaner story into a legal consultation.</h3>
              <p>Print or save this brief together with the original documents. Keep the original source links available for verification.</p>
              <button className="button button-accent full" type="button" onClick={() => window.print()}>Prepare consultation copy <Icon name="arrow" size={18} /></button>
            </article>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
