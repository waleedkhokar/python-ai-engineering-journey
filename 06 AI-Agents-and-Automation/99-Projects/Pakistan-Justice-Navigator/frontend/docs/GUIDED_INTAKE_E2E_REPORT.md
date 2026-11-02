# Guided Case Intake — End-to-End Test & Technical Review

Written for: the Member 1 team and reviewers who need to know what was verified, what was fixed, and what is still open.

Scope: `/case/new` (Guided Case Intake) → `POST /api/triage` (Next.js) → FastAPI `POST /api/v1/triage` → triage service → case save → `/case/[id]` brief.

## 1. Executive summary

Intake works end to end in the browser for the default flow, and the FastAPI triage endpoint works and validates input correctly. Three integration problems made it look healthier than it was: the backend was never actually called in the default setup, backend failures were hidden behind a demo fallback, and some inputs produced 500s or silent demo output. Those are fixed. Remaining gaps are mostly backend-mode feature parity (question types, documents) and the real LLM path, which could not be tested without credentials.

Overall condition: **usable for further development; the backend integration needs follow-up work before it is production-ready.**

## 2. Architecture (as found)

```
Browser: components/case-intake.tsx  (localStorage draft "pjn:intake:v2")
   │ POST /api/triage {description, language}
   ▼
Next.js route app/api/triage/route.ts
   │ if BACKEND_API_URL set: POST {BACKEND_API_URL}/api/v1/triage  (12 s timeout)
   │ otherwise, or on any failure: lib/demo-triage.ts (deterministic, TS)
   ▼
FastAPI backend/app/main.py → api/routes.py → TriageService
   │ LLM (OpenAI-compatible, JSON schema) if LLM_API_KEY + LLM_MODEL set
   │ otherwise / on error: services/fallback.py (deterministic Python)
   ▼
Case save: lib/case-store.ts → localStorage "pjn:cases:v2" always;
           Supabase `cases` table only if NEXT_PUBLIC_SUPABASE_* are set
   ▼
/case/[id] → components/case-result.tsx (reads the same store)
```

Notes: FastAPI has no CORS middleware; browsers never call it directly (they go through the Next route), so this is not a problem today. Supabase persistence is optional and was not exercised.

## 3. Testing results

| # | Test case | Expected | Actual | Status | Notes |
|---|---|---|---|---|---|
| B1 | Backend unit tests (`pytest`, 5 tests) | All pass | 5 passed | Pass | Runs with the LLM unconfigured, so the fallback path is what is tested |
| B2 | `GET /health` | 200 `{"status":"ok"}` | 200 | Pass | |
| B3 | Valid triage request | 200, full schema | 200 in ~0.3 s, schema matches `TriageResult` | Pass | Deterministic fallback output (no LLM key) |
| B4 | Missing `message` | 422 with field error | 422, `loc: body.message` | Pass | |
| B5 | Empty `message` | 422 | 422 `string_too_short` | Pass | |
| B6 | Unknown `language` | 422 enum error | 422, lists allowed values | Pass | |
| B7 | Unknown extra field | 422 (`extra="forbid"`) | 422 `extra_forbidden` | Pass | |
| B8 | Malformed JSON | 422 | 422 `json_invalid` | Pass | |
| B9 | Message > 12000 chars | 422 | 422 | Pass | The Next route used to hide this (see Issue 4) |
| B10 | CORS preflight | Depends on need | 405 — no CORS middleware | Not needed today | Only matters if browsers call FastAPI directly |
| F1 | `npm run typecheck` | No errors | Pass before and after fixes | Pass | |
| F2 | `npm run test:core` (corpus, copy, landing, member4 scripts) | All pass | All 9 checks pass | Pass | Ran before the fixes; these scripts do not cover intake |
| R1 | `/api/triage` with backend up | `mode: "backend"` | `mode: "backend"`, backend log shows 200 | Pass | After env fix (Issue 1) |
| R2 | `/api/triage` with default env (before fix) | Backend used | `mode: "demo"`, backend got zero requests | **Fail (was)** | Issue 1 |
| R3 | `/api/triage` backend stopped | 200, explicit fallback mode | `mode: "demo-fallback"`, HTTP 200 | Pass | UI notice added (Issue 2) |
| R4 | Short description (< 20 chars) | 400 | 400 | Pass | |
| R5 | Non-JSON body | 400 | Was 500; now 400 `Request body must be JSON.` | Fixed | Issue 3 |
| R6 | Description > 12000 chars | 400 with message | Was silent demo result; now 400 | Fixed | Issue 4 |
| U1 | Step 1: empty / <20 / ≥20 chars gating | Button disabled until 20 chars | Pass | Pass | Chrome, scripted |
| U2 | Step 2 triage error (HTTP 500) | Error panel, text kept, Retry | Pass | Pass | |
| U3 | Step 2 Continue gating; Back keeps answer | Pass | Pass | Pass | |
| U4 | Yes/No choice buttons (demo engine) | 3 choices, active state | Pass (demo run) | Pass | Not rendered in backend mode — see Issue 7 |
| U5 | Step 3 file add/remove; "Not analyzed" label | Pass | Pass | Pass | Files are never reported as analyzed |
| U6 | Reload mid-intake restores step and files | Pass | Pass | Pass | |
| U7 | Step 4 consent gating | Create disabled until consent | Pass | Pass | |
| U8 | Create → `/case/PJN-XXXXXXXX` → brief shows story, answers, file status | Pass | Pass | Pass | Brief shows "NOT ANALYZED" for files |
| U9 | Intake draft cleared after create | Pass | Pass | Pass | |
| U10 | Unknown case id | "not found" state | Pass | Pass | |
| U11 | 375 px viewport, horizontal overflow | None | 0 px overflow | Pass | Screenshot only; no detailed visual review |
| U12 | Form labels on step 1 | No unlabeled inputs | 0 unlabeled | Pass | Step 2 answer input not checked (placeholder only) |
| U13 | Uncaught page errors during the flow | None | None; only the mocked 500 and missing `/favicon.ico` 404 | Pass | |
| X1 | Real LLM triage (JSON-schema path) | LLM output validated | Not run | **Blocked** | `LLM_API_KEY` and `LLM_MODEL` are empty |
| X2 | Supabase persistence (`cases` upsert, RLS) | Row created for owner | Not run | **Blocked** | No Supabase config in the environment |
| X3 | Production build (`next build`) | Builds | Not run | Not run | Only dev server and typecheck were exercised |

Scripted UI suite: `scratch-ui/intake-e2e.mjs` (outside the git repo; Chrome via `playwright-core`). Final run: **28/28 pass** with the backend connected.

## 4. Issues

Severity: Critical = blocks intake; High = wrong behaviour or data integrity; Medium = usability/reliability; Low = minor.

| # | Sev | Issue | File | Root cause | Repro | Fix | Status |
|---|---|---|---|---|---|---|---|
| 1 | High | Backend triage never called in the default setup | `pjn-member1/.env.local` (root), `frontend/` | Next.js reads env files from `frontend/`; `BACKEND_API_URL` lived in the repo-root `.env.local`, so it was ignored | Start frontend normally with backend on :8000, call `/api/triage` → `mode: "demo"`; backend logs no request | Created `frontend/.env.local` with `BACKEND_API_URL=http://localhost:8000` (gitignored). Other developers must do the same, or copy the line from `frontend/.env.example` | Fixed (local config) |
| 2 | High | Backend failures silently replaced by demo output; UI never says so | `app/api/triage/route.ts`, `components/case-intake.tsx` | Route returns HTTP 200 with the demo engine on any upstream failure and does not tell the UI which engine ran | Stop backend → `mode: "demo-fallback"`, HTTP 200, no UI indication | Step 2 now shows a notice whenever `mode !== "backend"` | Fixed (code; the notice itself not UI-tested) |
| 3 | Medium | Non-JSON request body → unhandled 500 | `app/api/triage/route.ts` | `request.json()` not wrapped | `curl -d notjson` → 500 | Returns 400 `Request body must be JSON.` | Fixed, verified |
| 4 | Medium | Story > 12000 chars silently fell back to demo | `app/api/triage/route.ts` | Backend 422 swallowed by the fallback path; no length check in Next | 12001-char story → 200 demo result | Route returns 400 with the limit | Fixed, verified |
| 5 | Medium | Answers from a previous analysis carried over; counts were wrong | `components/case-intake.tsx` | Answers keyed by question id (`q1`…), reused across engines; not reset on re-analysis | Analyze, answer, change story, analyze again → old answers still counted | Answers reset when the question set (id + prompt) changes | Fixed (code; not UI-tested) |
| 6 | Medium | Case ID collisions could overwrite an earlier local case | `components/case-intake.tsx` | `PJN-` + last 6 digits of `Date.now()` repeats every ~1000 s; local save dedupes by id | Two cases ~1000 s × k apart share an id | ID now uses base-36 time plus random suffix | Fixed; UI test shows new format |
| 7 | Medium | Backend mode never offers Yes/No or date questions | `app/api/triage/route.ts` (`toFrontendTriage`) | Backend has no question `type`; mapper hard-codes `"text"` | Backend mode → text inputs only (observed in U4 run) | Needs backend schema change (add `answer_type`) or mapping rules | Pending |
| 8 | Medium | Document suggestions empty in backend mode | `app/api/triage/route.ts` | Mapper sets `suggestedDocuments: []`; backend has no equivalent field | Step 3 shows no "may be useful" tags | Needs backend field or mapping | Pending |
| 9 | Medium | Backend LLM failures are invisible in the response | `backend/app/services/triage_service.py` | `except` returns the fallback with no flag | Backend responses look identical whether the LLM ran or not | Add `engine` field to the response schema | Pending |
| 10 | Low | `saveCase` swallows errors, so "could not be saved" is unreachable | `lib/case-store.ts`, `case-intake.tsx` | `saveCase` returns `"local"` in its catch; `finishCase`'s catch never runs | Break Supabase config → still redirects. Local save happens first, so no data loss | Make the result surface, or drop the dead branch | Pending |
| 11 | Low | Mis-matched ports in docs | `backend/README.md` (8001), root `.env.local` (8000) | Docs drift | Follow README → backend on 8001, app points at 8000 | Align docs | Pending |
| 12 | Low | `/favicon.ico` 404 | `app/` | No favicon | Console 404 | Add icon | Pending |
| 13 | Low | Server error message not shown to user; generic text only | `case-intake.tsx` | `analyze()` discards the response body | 400 shows the generic "couldn't organize" message | Show `error` from the route | Pending |
| 14 | Low | Step 2 answer input has placeholder but no label | `case-intake.tsx` | No `<label>`/`aria-label` | Screen reader announces no name | Add `aria-label` | Pending |
| 15 | **Hygiene** | Root `.env.local` is **staged** in git (`A .env.local`), and no root `.gitignore` covers it | git index | Repo root isn't covered by `frontend/.gitignore` | `git status` | Needs a decision: `git rm --cached .env.local` plus a root `.gitignore` | **Blocked on owner** — not changed |

## 5. FastAPI integration status

**Partially functional.**

Supported by evidence:
- Server starts (`uvicorn app.main:app`); health returns 200.
- Request validation and error shapes are correct (B4–B9).
- Next → FastAPI round trip works once `BACKEND_API_URL` is loaded (R1), and the backend log confirms the request.
- Fallback when the backend is down works (R3).

Not verified:
- Real LLM output and its validation (X1 blocked: no key/model).
- Supabase persistence (X2 blocked: no config).
- CORS only matters for direct browser calls (none today).

## 6. Remaining work (priority order)

1. Decide on the staged root `.env.local` (Issue 15).
2. Extend the backend response with `engine` and `answer_type` / `suggested_documents` (Issues 7–9) so backend mode matches the UI.
3. Run the real LLM path with credentials, and add a backend test using a stub OpenAI-compatible server (no network).
4. Surface `saveCase` failures or remove the dead branch (Issue 10).
5. Small UX/a11y items (Issues 11–14).
6. Run `next build` and add intake checks to `npm run check`.

## 7. Overall readiness

**Requires additional fixes before deeper integration work.** The intake flow itself is sound for the demo engine and the local-save path. Backend-connected intake is now reachable and honest about fallbacks, but its question and document features are reduced, and the LLM path and cloud persistence are unverified.

## 8. Feature recommendations (not started)

1. **Plain-language procedure guide per case category** — step-by-step "what happens next" for property and rent disputes, built from the existing `legal_documents` corpus, with each step linked to its official source. Users: citizens without lawyers. Value: fewer missed steps. Complexity: Medium. Depends on verified source text (Member 4 ingestion).
2. **Roman Urdu / Urdu glossary tooltips** — inline definitions for terms like "mutation", "FIR", "possession". Users: low-literacy and Urdu-first users. Complexity: Low. Depends on vetted translations; must avoid implying legal advice.
3. **Deadline-awareness checklist from user-entered dates** — flags that a stated date may matter, with a prompt to verify with an authority. Complexity: Medium. Risk: must not present computed deadlines as legal fact.

## 9. Changes made in this review

- `frontend/app/api/triage/route.ts` — JSON parse guard (400), 12000-character limit (400).
- `frontend/components/case-intake.tsx` — answers reset when question set changes; mode notice; new case ID format.
- `frontend/.env.local` — created locally (gitignored) with `BACKEND_API_URL`.
- `backend/.venv/` — created for testing (gitignored).

Nothing was committed.
