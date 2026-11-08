export type Language = "en" | "roman-ur" | "ur";

export type LegalDocumentMeta = {
  document_id: string;
  title: string;
  document_type: string;
  jurisdiction: string;
  authority: string;
  source_name: string;
  source_url: string;
  priority: string;
};

export type FollowUpQuestion = {
  id: string;
  prompt: string;
  type: "text" | "yes_no" | "date";
};

export type TriageResult = {
  mode: "demo" | "backend" | "demo-fallback";
  category: string;
  summary: string;
  urgency: "low" | "medium" | "high";
  facts: string[];
  legalIssues: string[];
  missingInformation: string[];
  suggestedDocuments: string[];
  followUpQuestions: FollowUpQuestion[];
  sourceIds: string[];
  guardrail: string;
};

export type CaseDocument = {
  name: string;
  size: number;
  type: string;
  status: "selected" | "uploaded" | "processing" | "analyzed" | "failed";
};

export type CaseDraft = {
  caseId: string;
  language: Language;
  description: string;
  answers: Record<string, string>;
  documents: CaseDocument[];
  triage: TriageResult;
  consentAcknowledged: boolean;
  createdAt: string;
  updatedAt: string;
};

export type IntakeDraft = {
  version: 2;
  language: Language;
  step: number;
  description: string;
  answers: Record<string, string>;
  documents: CaseDocument[];
  triage: TriageResult | null;
  updatedAt: string;
};
