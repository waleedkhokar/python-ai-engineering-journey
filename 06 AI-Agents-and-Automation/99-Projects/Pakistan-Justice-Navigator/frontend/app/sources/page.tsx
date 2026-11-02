import { SourceLibrary } from "@/components/source-library";
import { Reveal } from "@/components/reveal";
import { legalDocuments } from "@/lib/corpus";

export default function SourcesPage() {
  const available = legalDocuments.filter((doc) => !doc.title.toLowerCase().includes("placeholder"));

  return (
    <div className="page-shell sources-page">
      <Reveal className="sources-header">
        <div>
          <span className="eyebrow">OFFICIAL SOURCE DIRECTORY —</span>
          <h1>See the source before relying on the summary.</h1>
          <p className="lede">This directory surfaces official legislation links already available to the project. Exact sections, quotations and case-law relevance should only be shown after source verification confirms them.</p>
        </div>
      </Reveal>

      <Reveal className="source-explainer" delay={80}>
        <div><span>01</span><strong>Official title</strong><small>Keep the document identity intact.</small></div>
        <div><span>02</span><strong>Original authority</strong><small>Prefer government and court systems.</small></div>
        <div><span>03</span><strong>Exact provision</strong><small>Display only when retrieval confirms it.</small></div>
        <div><span>04</span><strong>Human review</strong><small>Important rights and deadlines still deserve professional confirmation.</small></div>
      </Reveal>

      <div className="notice-panel">
        <span className="notice-dot" aria-hidden="true">!</span>
        <p>Source links help you inspect the original material. A matching title does not by itself prove that a particular section or judgment decides your situation.</p>
      </div>

      <SourceLibrary documents={available} />
    </div>
  );
}
