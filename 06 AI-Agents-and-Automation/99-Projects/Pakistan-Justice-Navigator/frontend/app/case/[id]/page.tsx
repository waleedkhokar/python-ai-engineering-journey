import { CaseResult } from "@/components/case-result";
import { legalDocuments } from "@/lib/corpus";
import type { LegalDocumentMeta } from "@/lib/types";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sourceMap = Object.fromEntries(legalDocuments.map((doc) => [doc.document_id, doc])) as Record<string, LegalDocumentMeta>;
  return <div className="page-shell case-result-page"><CaseResult sourceMap={sourceMap} caseId={id} /></div>;
}
