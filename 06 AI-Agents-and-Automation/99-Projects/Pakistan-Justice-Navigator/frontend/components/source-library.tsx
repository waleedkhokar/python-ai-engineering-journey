"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import type { LegalDocumentMeta } from "@/lib/types";
import { Icon } from "./icons";
import { Reveal } from "./reveal";

export function SourceLibrary({ documents }: { documents: LegalDocumentMeta[] }) {
  const [query, setQuery] = useState("");
  const [jurisdiction, setJurisdiction] = useState("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesQuery = !normalized || [doc.title, doc.authority, doc.document_type].join(" ").toLowerCase().includes(normalized);
      const matchesJurisdiction = jurisdiction === "All" || doc.jurisdiction === jurisdiction;
      return matchesQuery && matchesJurisdiction;
    });
  }, [documents, jurisdiction, query]);

  return (
    <div className="source-library">
      <div className="source-tools surface-card">
        <label className="searchbox">
          <Icon name="search" size={18} />
          <span className="sr-only">Search official sources</span>
          <input value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} placeholder="Search law or authority" />
        </label>
        <div className="filter-row" aria-label="Jurisdiction filters">
          {["All", "Federal", "Sindh"].map((item) => (
            <button key={item} type="button" className={jurisdiction === item ? "chip chip-active" : "chip"} onClick={() => setJurisdiction(item)}>{item}</button>
          ))}
        </div>
      </div>

      <p className="microcopy">{filtered.length} official source {filtered.length === 1 ? "record" : "records"} shown — exact legal relevance remains case-specific.</p>

      <div className="source-grid">
        {filtered.map((doc, index) => (
          <Reveal key={doc.document_id} delay={(index % 6) * 45}>
            <article className="source-card surface-card">
              <div className="source-card-top">
                <span className="source-index">— {String(index + 1).padStart(2, "0")}</span>
                <span className="status"><Icon name="shield" size={12} /> Official source link</span>
              </div>
              <h3>{doc.title}</h3>
              <dl>
                <div><dt>Authority</dt><dd>{doc.authority}</dd></div>
                <div><dt>Jurisdiction</dt><dd>{doc.jurisdiction}</dd></div>
                <div><dt>Type</dt><dd>{doc.document_type}</dd></div>
                <div><dt>Source</dt><dd>{doc.source_name}</dd></div>
              </dl>
              <a href={doc.source_url} target="_blank" rel="noreferrer" className="text-link">Open original source <Icon name="external" size={16} /></a>
            </article>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && <div className="empty-inline">No matching official source is available in the current directory.</div>}
    </div>
  );
}
