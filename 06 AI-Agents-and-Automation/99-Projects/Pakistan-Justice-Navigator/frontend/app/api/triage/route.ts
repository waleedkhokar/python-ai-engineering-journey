import { NextResponse } from "next/server";
import { runDemoTriage } from "@/lib/demo-triage";
import type { Language, TriageResult } from "@/lib/types";

export const runtime = "nodejs";

// Shape returned by the FastAPI triage service (backend/app/schemas/triage.py).
type BackendTriage = {
  category: string;
  subcategory: string;
  summary: string;
  urgency: "low" | "medium" | "high" | "critical" | "unknown";
  facts: string[];
  issues: { issue: string }[];
  missing_facts: string[];
  follow_up_questions: { id: string; question: string }[];
  source_ids_used: string[];
  disclaimer: string;
};

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "roman-ur" || value === "ur";
}

function toBackendLanguage(language: Language) {
  return language === "ur" ? "urdu" : language === "roman-ur" ? "roman_urdu" : "english";
}

function toFrontendTriage(result: BackendTriage): Omit<TriageResult, "mode"> {
  const urgency = result.urgency === "critical" ? "high" : result.urgency === "unknown" ? "medium" : result.urgency;
  return {
    category: result.category,
    summary: result.summary,
    urgency,
    facts: result.facts,
    legalIssues: result.issues.map((item) => item.issue),
    missingInformation: result.missing_facts,
    suggestedDocuments: [],
    followUpQuestions: result.follow_up_questions.map((item) => ({ id: item.id, prompt: item.question, type: "text" as const })),
    sourceIds: result.source_ids_used,
    guardrail: result.disclaimer
  };
}

// Matches the FastAPI TriageRequest.message limit (backend/app/schemas/triage.py).
const MAX_DESCRIPTION_LENGTH = 12000;

export async function POST(request: Request) {
  let body: { description?: unknown; language?: unknown };
  try {
    body = (await request.json()) as { description?: unknown; language?: unknown };
  } catch {
    return NextResponse.json({ error: "Request body must be JSON." }, { status: 400 });
  }
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const language: Language = isLanguage(body.language) ? body.language : "en";

  if (description.length < 20) {
    return NextResponse.json(
      { error: "Please provide at least 20 characters describing the legal problem." },
      { status: 400 }
    );
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return NextResponse.json(
      { error: `Please keep your story under ${MAX_DESCRIPTION_LENGTH} characters.` },
      { status: 400 }
    );
  }

  const backendUrl = process.env.BACKEND_API_URL?.replace(/\/$/, "");

  if (backendUrl) {
    try {
      const upstream = await fetch(`${backendUrl}/api/v1/triage`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-pjn-client": "citizen-web" },
        body: JSON.stringify({ message: description, language: toBackendLanguage(language) }),
        cache: "no-store",
        signal: AbortSignal.timeout(12000)
      });

      if (upstream.ok) {
        const result = toFrontendTriage((await upstream.json()) as BackendTriage);
        return NextResponse.json({ ...result, mode: "backend" });
      }
    } catch {
      // Resilience fallback: keep intake usable if the external triage service is temporarily unavailable.
    }
  }

  const demo = runDemoTriage(description, language);
  return NextResponse.json({ ...demo, mode: backendUrl ? "demo-fallback" : "demo" });
}
