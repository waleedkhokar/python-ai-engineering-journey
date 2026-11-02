# Member 4 Setup — Official Legal Corpus / Retrieval

## 1. Create one Python environment at the project root

```powershell
cd "D:\pakistan-justice-navigator-member1\pjn-member1"
py -m venv .venv
Set-ExecutionPolicy -Scope Process Bypass
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r services\legal-rag\requirements.txt
```

## 2. Fetch the currently verified official PDFs

```powershell
python scripts\fetch_initial_official_docs.py
```

The downloader reads `data\member4_manifest.csv` and automatically targets rows marked `source_url_verified` whose URL is a direct PDF. The current starter manifest has 13 such Pakistan Code entries. It only accepts approved official hosts and PDF-signature responses. Failed downloads remain failed; do not replace them with blogs or mirrors.

Files are routed by metadata into the constitution, federal, Sindh or court corpus folders so future sources do not all fall into `federal_laws`.

## 3. Extract and chunk the corpus

```powershell
python scripts\ingest_corpus.py --summary
```

The output is:

```text
data\rag_index\legal_chunks.jsonl
```

Each chunk preserves source provenance including document ID/title, authority, jurisdiction, court/bench where applicable, source URL, page, section/article hint and content hash.

## 4. Apply Supabase migrations

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Then execute `supabase\seed.sql` in the Supabase SQL Editor (or via your existing `psql` workflow).

Migration `003_member4_legal_rag.sql` adds judgment bench preservation, `legal_chunks`, PostgreSQL full-text retrieval, optional `vector(384)` storage/HNSW indexing and server-only corpus mutation permissions.

## 5. Run locally without Supabase

```powershell
cd services\legal-rag
uvicorn app:app --reload --host 127.0.0.1 --port 8001
```

With ingested local chunks, `/v1/search` uses them directly. If no chunks exist, it returns a clearly labelled metadata-only fallback.

Set in the Next.js root `.env.local`:

```env
LEGAL_RAG_API_URL=http://127.0.0.1:8001
```

Restart `npm run dev` and open `/research`.

## 6. Push real chunks to Supabase

From a terminal with the root `.venv` activated:

```powershell
cd "D:\pakistan-justice-navigator-member1\pjn-member1"
$env:SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
$env:SUPABASE_SECRET_KEY="YOUR_SERVER_SECRET"
python scripts\push_chunks_to_supabase.py
```

The uploader refuses an empty index and updates only represented source documents to `ingested` after successful chunk upload.

Never place `SUPABASE_SECRET_KEY` in browser code or `NEXT_PUBLIC_*` variables.

## 7. Retrieval modes

The service deliberately reports its mode:

```text
supabase-lexical       real chunks stored in Supabase
local-ingested-chunks  real chunks stored in local JSONL
metadata-only          source discovery only; not evidence
```

The schema is vector-ready, but the hackathon baseline does not invent embeddings. Add semantic/hybrid search only after choosing a reproducible 384-dimensional embedding model for both indexing and queries.
