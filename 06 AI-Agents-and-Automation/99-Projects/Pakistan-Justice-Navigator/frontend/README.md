# Pakistan Justice Navigator — Integrated Citizen Experience + Legal Research v0.5

This package combines two team responsibilities into one testable hackathon build:

- **Member 1 — Citizen Experience:** a single-stage cinematic landing experience (650vh scroll track + one sticky viewport), demo access, dashboard, multilingual case intake, document-selection UX, citizen brief, provenance presentation, persistence, and frontend integration boundaries.
- **Member 4 — Official Legal Research / RAG Foundation:** corpus governance, official-source acquisition, PDF extraction, provenance-preserving chunking, local retrieval, Supabase/pgvector schema, and a FastAPI research service.

## Product promise

The interface deliberately distinguishes four states:

1. **You reported** — information supplied by the citizen.
2. **AI organized** — preliminary organization and review points.
3. **Source candidate** — official material that may be relevant but has not yet been retrieved as evidence.
4. **Verified evidence** — source/document text actually retrieved from an ingested official document.

A metadata title is never upgraded into an exact section/article claim.

## Frontend stack

- Next.js 16.3.8
- React 19.2
- TypeScript
- Native scroll-linked/pointer-linked motion (no extra animation dependency): one continuous sticky world with overlapping phases, depth transforms, pointer parallax, and reduced-motion fallback
- Optional Member 2 backend through `BACKEND_API_URL`
- Optional Member 4 FastAPI service through `LEGAL_RAG_API_URL`
- Optional Supabase citizen persistence through browser-safe public keys

## Member 4 stack

- Python / FastAPI
- `pypdf` extraction
- lexical retrieval as the reliable baseline
- PostgreSQL / Supabase
- `pgvector`-ready `vector(384)` column for a later real embedding model
- full-text search via PostgreSQL `tsvector`

## Current corpus state

The starter registry contains 35 records. Five SHC rows supplied in the starter data are placeholders and are quarantined from evidence retrieval. Thirteen federal/constitutional records currently have direct official Pakistan Code PDF endpoints recorded in the manifest. The actual PDFs are intentionally not bundled when they cannot be fetched from the official host; use the acquisition script on a machine with access to those sources.

## Fast start — frontend

```powershell
npm install
npm run test:core
npm run typecheck
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Fast start — Member 4 service

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r services\legal-rag\requirements.txt
python scripts\fetch_initial_official_docs.py
python scripts\ingest_corpus.py
cd services\legal-rag
uvicorn app:app --reload --host 127.0.0.1 --port 8001
```

Then set this in the frontend `.env.local` and restart Next.js:

```env
LEGAL_RAG_API_URL=http://127.0.0.1:8001
```

## Environment boundaries

Root `.env.local` may contain only browser-safe Supabase values plus internal server URLs:

```env
BACKEND_API_URL=http://localhost:8000
LEGAL_RAG_API_URL=http://127.0.0.1:8001
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never place a Supabase secret/service-role key or an LLM secret in a `NEXT_PUBLIC_*` variable.

## Supabase

Apply, in order:

1. `supabase/migrations/001_member1_schema.sql`
2. `supabase/migrations/002_member1_polish.sql`
3. `supabase/migrations/003_member4_legal_rag.sql`
4. `supabase/seed.sql`

The Member 4 secret values are server-side environment variables only:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

## Documentation

- `docs/MASTER_IMPLEMENTATION_PLAN.md` — full Member 1 + Member 4 plan.
- `docs/IMPLEMENTATION_CHALLENGE_LOG.md` — the requested question-everything/self-critique log.
- `docs/MEMBER4_SETUP.md` — corpus/RAG setup.
- `docs/API_CONTRACT.md` — team integration contracts.
- `docs/TEAM_COMMANDS.md` — Windows/PowerShell replacement and run commands.
- `docs/TEST_REPORT.md` — exact verification status and environment limitations.
