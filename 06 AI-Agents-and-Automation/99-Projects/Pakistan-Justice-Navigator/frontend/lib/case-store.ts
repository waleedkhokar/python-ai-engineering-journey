"use client";

import type { CaseDraft, IntakeDraft } from "./types";

const INTAKE_KEY = "pjn:intake:v2";
const CASES_KEY = "pjn:cases:v2";
const SESSION_KEY = "pjn:supabase-session:v1";

type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  user: { id: string };
};

function browser() { return typeof window !== "undefined"; }
function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

function readSession(): SupabaseSession | null {
  if (!browser()) return null;
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) ?? "null") as SupabaseSession | null; } catch { return null; }
}
function writeSession(session: SupabaseSession) {
  if (browser()) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

async function authRequest(url: string, key: string, path: string, body: unknown) {
  const response = await fetch(`${url}/auth/v1/${path}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`Supabase auth failed (${response.status})`);
  return (await response.json()) as SupabaseSession;
}

async function ensureSession(): Promise<{ session: SupabaseSession; url: string; key: string } | null> {
  const cfg = config();
  if (!cfg) return null;
  let session = readSession();
  const now = Math.floor(Date.now() / 1000);
  if (session?.access_token && (!session.expires_at || session.expires_at > now + 60)) return { session, ...cfg };
  if (session?.refresh_token) {
    try {
      session = await authRequest(cfg.url, cfg.key, "token?grant_type=refresh_token", { refresh_token: session.refresh_token });
      writeSession(session);
      return { session, ...cfg };
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }
  session = await authRequest(cfg.url, cfg.key, "signup", { data: { app: "pakistan-justice-navigator" }, gotrue_meta_security: {} });
  writeSession(session);
  return { session, ...cfg };
}

async function dataRequest(path: string, options: RequestInit = {}) {
  const auth = await ensureSession();
  if (!auth) return null;
  const response = await fetch(`${auth.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: auth.key,
      Authorization: `Bearer ${auth.session.access_token}`,
      ...(options.headers ?? {})
    }
  });
  if (!response.ok) throw new Error(`Supabase data request failed (${response.status})`);
  return response;
}

export function saveIntakeDraft(draft: IntakeDraft) {
  if (browser()) window.localStorage.setItem(INTAKE_KEY, JSON.stringify(draft));
}
export function loadIntakeDraft(): IntakeDraft | null {
  if (!browser()) return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(INTAKE_KEY) ?? "null") as IntakeDraft | null;
    return parsed?.version === 2 ? parsed : null;
  } catch { return null; }
}
export function clearIntakeDraft() { if (browser()) window.localStorage.removeItem(INTAKE_KEY); }

function readLocalCases(): CaseDraft[] {
  if (!browser()) return [];
  try { return JSON.parse(window.localStorage.getItem(CASES_KEY) ?? "[]") as CaseDraft[]; } catch { return []; }
}
function writeLocalCases(cases: CaseDraft[]) { if (browser()) window.localStorage.setItem(CASES_KEY, JSON.stringify(cases.slice(0, 20))); }

export async function saveCase(draft: CaseDraft): Promise<"supabase" | "local"> {
  writeLocalCases([draft, ...readLocalCases().filter((item) => item.caseId !== draft.caseId)]);
  try {
    const auth = await ensureSession();
    if (!auth) return "local";
    await dataRequest("cases?on_conflict=public_case_id", {
      method: "POST",
      headers: { "content-type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        user_id: auth.session.user.id,
        public_case_id: draft.caseId,
        language: draft.language,
        category: draft.triage.category,
        summary: draft.triage.summary,
        urgency: draft.triage.urgency,
        status: "analysis",
        raw_description: draft.description,
        structured_payload: draft,
        updated_at: draft.updatedAt
      })
    });
    return "supabase";
  } catch { return "local"; }
}

export async function loadCase(caseId: string): Promise<CaseDraft | null> {
  const local = readLocalCases().find((item) => item.caseId === caseId);
  if (local) return local;
  try {
    const response = await dataRequest(`cases?public_case_id=eq.${encodeURIComponent(caseId)}&select=structured_payload&limit=1`);
    if (!response) return null;
    const rows = (await response.json()) as { structured_payload: CaseDraft }[];
    return rows[0]?.structured_payload ?? null;
  } catch { return null; }
}

export async function listCases(): Promise<CaseDraft[]> {
  const local = readLocalCases();
  try {
    const response = await dataRequest("cases?select=structured_payload&order=updated_at.desc&limit=20");
    if (!response) return local;
    const rows = (await response.json()) as { structured_payload: CaseDraft }[];
    const merged = new Map<string, CaseDraft>();
    [...rows.map((row) => row.structured_payload), ...local].filter(Boolean).forEach((item) => merged.set(item.caseId, item));
    return [...merged.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch { return local; }
}
