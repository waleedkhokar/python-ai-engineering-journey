# Pakistan Justice Navigator v0.5 — Replacement + Full Run Commands (Windows PowerShell)

These commands assume your current project is under `D:\pakistan-justice-navigator-member1\pjn-member1` and the new ZIP is in Downloads.

## 1. Stop old servers

In any terminal currently running Next.js/FastAPI, press:

```text
Ctrl + C
```

## 2. Replace the old project safely

```powershell
cd "D:\pakistan-justice-navigator-member1"

# Keep one backup.
if (Test-Path ".\pjn-member1-backup") {
    Remove-Item ".\pjn-member1-backup" -Recurse -Force
}
if (Test-Path ".\pjn-member1") {
    Rename-Item ".\pjn-member1" "pjn-member1-backup"
}

New-Item -ItemType Directory -Path ".\pjn-member1" | Out-Null

Expand-Archive `
  -Path "$env:USERPROFILE\Downloads\pakistan-justice-navigator-cinematic-v5.zip" `
  -DestinationPath "D:\pakistan-justice-navigator-member1\pjn-member1" `
  -Force

cd "D:\pakistan-justice-navigator-member1\pjn-member1"
dir package.json
```

`package.json` must appear directly in this folder.

## 3. Restore/create frontend environment file

```powershell
if (Test-Path "..\pjn-member1-backup\.env.local") {
    Copy-Item "..\pjn-member1-backup\.env.local" ".\.env.local"
}

if (!(Test-Path ".\.env.local")) {
    Copy-Item ".env.example" ".env.local"
}
```

Recommended `.env.local`:

```env
# Member 2, when available
BACKEND_API_URL=http://localhost:8000

# Member 4 service
LEGAL_RAG_API_URL=http://127.0.0.1:8001

# Browser-safe Supabase values only
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 4. Install and verify the frontend

```powershell
npm install
npm run test:core
npm run typecheck
npm run build
```

Do not merge if one of these commands fails.

## 5. Run the frontend

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Primary demo routes:

```text
/
/login
/dashboard
/case/new
/sources
/research
```

## 6. Set up the Member 4 Python environment

Open a second PowerShell terminal:

```powershell
cd "D:\pakistan-justice-navigator-member1\pjn-member1"

py -m venv .venv
Set-ExecutionPolicy -Scope Process Bypass
.\.venv\Scripts\Activate.ps1

python -m pip install --upgrade pip
python -m pip install -r services\legal-rag\requirements.txt
```

## 7. Fetch only verified official source PDFs

```powershell
python scripts\fetch_initial_official_docs.py
```

The downloader:

- reads `data\member4_manifest.csv`;
- fetches only `source_url_verified` direct PDFs;
- restricts hosts to approved official domains;
- checks the response begins with a PDF signature;
- exits with an error instead of silently replacing a failed download with a blog/mirror.

If the official website is temporarily unavailable, keep the failed document un-ingested and retry later.

## 8. Extract + chunk the downloaded corpus

```powershell
python scripts\ingest_corpus.py --summary
```

The generated local index is:

```text
data\rag_index\legal_chunks.jsonl
```

Run Member 4 tests again after ingestion:

```powershell
npm run test:member4
```

## 9. Run the Member 4 FastAPI service locally

Stay in the activated Python environment:

```powershell
cd services\legal-rag
uvicorn app:app --reload --host 127.0.0.1 --port 8001
```

Health check in a third PowerShell terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8001/health
```

Search smoke test:

```powershell
$body = @{ query = "property transfer"; limit = 5 } | ConvertTo-Json
Invoke-RestMethod `
  -Uri http://127.0.0.1:8001/v1/search `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Expected modes are:

```text
supabase-lexical
local-ingested-chunks
metadata-only
```

`metadata-only` is intentionally labelled as non-evidence and must not be presented as an exact legal provision.

## 10. Apply Supabase schema

From the project root:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

This applies the three migration files. Then run `supabase\seed.sql` in your Supabase SQL Editor, or with `psql` if your team already uses it.

For citizen persistence, place only public project values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

For Member 4 corpus writes/search from the Python service, use server-side variables in the Python terminal only:

```powershell
$env:SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
$env:SUPABASE_SECRET_KEY="YOUR_SERVER_SECRET"
```

Never copy `SUPABASE_SECRET_KEY` into `.env.local` under a `NEXT_PUBLIC_*` name.

## 11. Push real chunks to Supabase

Only after `legal_chunks.jsonl` contains real chunks:

```powershell
cd "D:\pakistan-justice-navigator-member1\pjn-member1"
.\.venv\Scripts\Activate.ps1

$env:SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
$env:SUPABASE_SECRET_KEY="YOUR_SERVER_SECRET"

python scripts\push_chunks_to_supabase.py
```

The script refuses an empty index and marks only documents represented by real chunks as `ingested`.

## 12. Final team merge gate

```powershell
cd "D:\pakistan-justice-navigator-member1\pjn-member1"

git pull --rebase
npm install
npm run test:core
npm run typecheck
npm run build
python -m compileall services\legal-rag scripts
git status
```
