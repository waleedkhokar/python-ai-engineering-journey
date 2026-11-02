import { findRelevantSourceIds } from "./corpus";
import type { Language, TriageResult } from "./types";

function termMatches(text: string, term: string) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

function containsAny(text: string, words: string[]) {
  const normalized = text.toLowerCase();
  return words.some((word) => termMatches(normalized, word));
}

export function runDemoTriage(description: string, language: Language): TriageResult {
  const text = description.trim();
  const lower = text.toLowerCase();

  let category = "General legal issue";
  let legalIssues = ["Legal relationship", "Available evidence", "Applicable procedure"];
  let documents = ["Any notice, agreement, order, receipt or record connected to the problem"];
  let questions = [
    { id: "q1", prompt: "When did the problem first begin?", type: "date" as const },
    { id: "q2", prompt: "Do you have any written document connected to the dispute?", type: "yes_no" as const },
    { id: "q3", prompt: "What outcome are you hoping to achieve?", type: "text" as const }
  ];

  if (containsAny(lower, ["property", "plot", "land", "qabza", "possession", "inheritance", "inherited", "warasat"])) {
    category = "Property / inheritance";
    legalIssues = ["Ownership or inheritance basis", "Possession", "Registration / documentary record", "Possible civil remedy"];
    documents = ["Ownership / registry documents", "Inheritance or family records", "Any legal notice", "Receipts, mutations or transfer records"];
    questions = [
      { id: "q1", prompt: "Who is shown as owner in the latest document you have?", type: "text" as const },
      { id: "q2", prompt: "Is another person currently occupying or controlling the property?", type: "yes_no" as const },
      { id: "q3", prompt: "Have you received or sent a legal notice?", type: "yes_no" as const }
    ];
  } else if (containsAny(lower, ["fir", "police", "arrest", "bail", "criminal", "crime"])) {
    category = "Criminal procedure";
    legalIssues = ["Reported allegation", "Police / FIR status", "Procedural posture", "Evidence and representation"];
    documents = ["FIR or complaint copy", "Police notice", "Court order if any", "Identity and supporting evidence"];
    questions = [
      { id: "q1", prompt: "Has an FIR or formal complaint been registered?", type: "yes_no" as const },
      { id: "q2", prompt: "Is any court hearing or police appearance already scheduled?", type: "yes_no" as const },
      { id: "q3", prompt: "What is the case/FIR number, if available?", type: "text" as const }
    ];
  } else if (containsAny(lower, ["rent", "tenant", "landlord", "kiraya"])) {
    category = "Rent / tenancy";
    legalIssues = ["Tenancy relationship", "Rent / possession", "Notice", "Forum and procedure"];
    documents = ["Rent agreement", "Payment receipts", "Notices or messages", "Property documents if available"];
    questions = [
      { id: "q1", prompt: "Is there a written rent agreement?", type: "yes_no" as const },
      { id: "q2", prompt: "Has either side given a written notice?", type: "yes_no" as const },
      { id: "q3", prompt: "Which city/district is the rented property in?", type: "text" as const }
    ];
  } else if (containsAny(lower, ["contract", "agreement", "business", "payment", "vendor", "company"])) {
    category = "Contract / business";
    legalIssues = ["Contractual obligation", "Performance / breach", "Evidence of payment or delivery", "Dispute resolution clause"];
    documents = ["Signed agreement", "Invoices / receipts", "Emails or messages", "Any notice of breach"];
    questions = [
      { id: "q1", prompt: "Do you have a signed written agreement?", type: "yes_no" as const },
      { id: "q2", prompt: "What obligation do you say was not performed?", type: "text" as const },
      { id: "q3", prompt: "Does the agreement mention arbitration or another dispute process?", type: "yes_no" as const }
    ];
  } else if (containsAny(lower, ["harassment", "workplace", "office"])) {
    category = "Workplace harassment";
    legalIssues = ["Workplace conduct", "Internal complaint record", "Evidence", "Available complaint channel"];
    documents = ["Employment proof", "Messages / emails", "Complaint or HR record", "Witness details if relevant"];
    questions = [
      { id: "q1", prompt: "Have you already made an internal complaint?", type: "yes_no" as const },
      { id: "q2", prompt: "Do you have messages, emails or other records of the conduct?", type: "yes_no" as const },
      { id: "q3", prompt: "When did the most recent incident occur?", type: "date" as const }
    ];
  }

  const urgency: TriageResult["urgency"] =
    containsAny(lower, ["today", "tomorrow", "deadline", "arrest", "detained", "threat", "violence"])
      ? "high"
      : containsAny(lower, ["notice", "hearing", "court", "police"])
        ? "medium"
        : "low";

  const summary =
    text.length > 210 ? `${text.slice(0, 207)}...` : text || "No description supplied.";

  return {
    mode: "demo",
    category,
    summary,
    urgency,
    facts: text ? [text] : [],
    legalIssues,
    missingInformation: questions.map((question) => question.prompt),
    suggestedDocuments: documents,
    followUpQuestions: questions,
    sourceIds: findRelevantSourceIds(text),
    guardrail:
      language === "ur"
        ? "یہ ابتدائی معلوماتی ترتیب ہے، قانونی مشورہ یا حتمی قانونی رائے نہیں۔ اصل ماخذ اور وکیل سے تصدیق ضروری ہے۔"
        : language === "roman-ur"
          ? "Yeh ibtidai informational triage hai — legal advice ya final legal opinion nahin. Original source aur lawyer se verify karein."
          : "This is preliminary informational triage — not legal advice or a final legal opinion. Verify against original sources and a qualified lawyer."
  };
}
