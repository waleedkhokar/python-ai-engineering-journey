"use client";

import { FormEvent, useState, type ChangeEvent } from "react";
import { Icon } from "./icons";
import type { LegalSearchResult } from "@/lib/legal-search";

type SearchPayload = {
  mode: string;
  warning?: string;
  results: LegalSearchResult[];
};

const examples = ["inherited property possession", "tenant rent dispute", "FIR and bail", "workplace harassment"];

export function LegalResearchDemo() {
  const [query, setQuery] = useState("inherited property possession");
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(event?: FormEvent) {
    event?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/legal-search", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query, limit: 6 }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Search failed.");
      setPayload(body as SearchPayload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="research-demo">
      <section className="research-hero">
        <span className="cinema-kicker dark">OFFICIAL LEGAL RESEARCH —</span>
        <h1>Retrieve the source. <em>Then explain it.</em></h1>
        <p>Search official Pakistani legal sources and see clearly whether a result comes from verified source text or source metadata only.</p>
      </section>

      <form className="research-search" onSubmit={search}>
        <Icon name="search" size={21} />
        <input value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} aria-label="Legal research query" placeholder="Describe the legal issue" />
        <button type="submit" disabled={loading}>{loading ? "Searching…" : "Search sources"}</button>
      </form>
      <div className="research-examples">
        <span>Try —</span>{examples.map((example) => <button type="button" key={example} onClick={() => setQuery(example)}>{example}</button>)}
      </div>

      {error ? <div className="inline-form-error" role="alert">{error}</div> : null}
      {payload ? (
        <section className="research-results">
          <div className="research-mode"><span>RETRIEVAL MODE</span><strong>{payload.mode.replace(/-/g, " ")}</strong><small>{payload.warning ?? "Results come from ingested source chunks with provenance."}</small></div>
          <div className="research-result-list">
            {payload.results.map((result, index) => (
              <article className="research-result" key={`${result.document_id}-${index}`}>
                <div className="research-result-index">{String(index + 1).padStart(2, "0")}</div>
                <div>
                  <div className="research-tags"><span>{result.jurisdiction}</span><span>{result.evidence_level === "chunk" ? "retrieved chunk" : "metadata only"}</span></div>
                  <h2>{result.title}</h2>
                  <p>{result.snippet}</p>
                  <div className="research-provenance"><span><b>Authority</b>{result.authority || result.court}</span><span><b>Section / citation</b>{result.section_or_article || result.citation || "Not yet verified"}</span>{result.bench ? <span><b>Bench</b>{result.bench}</span> : null}</div>
                  <a href={result.source_url} target="_blank" rel="noreferrer">Open original source <Icon name="external" size={15} /></a>
                </div>
                <strong className="research-score">{result.score.toFixed(1)}</strong>
              </article>
            ))}
          </div>
          {payload.results.length === 0 ? <div className="dashboard-empty"><h3>No supported source match yet.</h3><p>Try a more specific issue or ingest additional official documents.</p></div> : null}
        </section>
      ) : (
        <section className="research-empty-state"><Icon name="book" size={28} /><div><strong>Describe the issue in your own words.</strong><p>The system can suggest relevant official sources, but it only shows exact provisions when the source text has actually been retrieved.</p></div></section>
      )}
    </div>
  );
}
