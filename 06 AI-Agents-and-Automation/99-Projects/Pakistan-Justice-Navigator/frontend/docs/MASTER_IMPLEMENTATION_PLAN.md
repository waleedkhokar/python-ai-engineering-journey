# Pakistan Justice Navigator — Integrated Member 1 + Member 4 Master Plan

## 1. Product objective
Build one coherent Pakistani legal-tech experience: a citizen can understand the case-preparation journey, create and revisit a case, and see legal-source provenance without the interface ever pretending that an unverified source title is an exact legal answer.

The product has two independent but connected layers:

- **Member 1 — Citizen Experience:** landing, access, dashboard, intake, results, frontend persistence and integration states.
- **Member 4 — Official Legal Research / RAG:** corpus governance, official-source ingestion, chunking, provenance, retrieval, Supabase/pgvector schema and research API.

## 2. Non-negotiable product rules
1. Official Tier-1 sources first.
2. Citizen statements, AI organization and verified evidence must be visually/structurally distinct.
3. Metadata-only matches cannot produce an exact section/article claim.
4. Placeholder judgments never enter retrieval.
5. Browser code never receives Supabase secret/service credentials or LLM secrets.
6. Every error has a transparent fallback; no feature silently fabricates data.
7. Motion must have a reduced-motion fallback.
8. Demo authentication must be labeled as demo behavior rather than imitating production security.

---

# Member 1 — Citizen Experience

## M1.1 Cinematic landing
### Goal
Make the public entry feel like a premium promotion experience rather than a card-based SaaS homepage.

### Implemented experience
- Brown / light-brown / Pakistan green / warm-white art direction.
- Fixed glass-like navigation with proper product links and CTA.
- Six full-viewport sticky scenes.
- Scroll-linked scene progress drives depth, scale, rotation and parallax.
- Pointer-reactive perspective on the hero for desktop/pointer devices.
- Background architecture, floating documents, orbiting legal issues, source monolith, exploded document and layered final brief.
- Reduced-motion mode converts pinned scenes into normal readable sections.
- Professional full footer with copyright and legal-information disclaimer.

### Story sequence
1. Justice should not feel out of reach.
2. Start with what happened.
3. Understand / organize / verify.
4. Pakistani law, not generic AI.
5. Document intelligence.
6. Lawyer-ready brief.

## M1.2 Demo access/login
### Goal
Provide a believable demo entry without collecting a fake password or pretending local storage is real authentication.

### Implemented
- Name + email only.
- Clear `DEMO ACCESS` label.
- Browser-local demo profile.
- Inline validation.
- Premium brown stage + ivory floating form.
- No password field.
- No citizen-facing framework/Supabase implementation language.

### Production handoff
Replace local demo identity with Supabase Auth later; do not change the rest of the citizen flow contract.

## M1.3 Dashboard
### Goal
A calm continuation surface after the cinematic landing.

### Implemented
- New-case CTA.
- Existing cases loaded from case-store abstraction.
- Document/brief counts.
- Empty/loading states.
- Official Sources entry.
- Official Legal Research entry.
- Brown depth rail, green actions, subtle architectural background.
- Responsive mobile layout.

## M1.4 Citizen intake
### Implemented
- English / Roman Urdu / Urdu.
- Description first, not legal terminology.
- One clarification at a time.
- Quick answers + text/date questions.
- Review previous answers.
- Draft autosave.
- Save and exit.
- Optional document selection.
- Removable file queue.
- Honest statuses (`selected` is not `analyzed`).
- Consent/acknowledgement before brief creation.
- Inline retry/error states.

## M1.5 Result / brief
### Implemented provenance model
- **You reported** — citizen-supplied information.
- **AI organized** — preliminary organization/review issues.
- **Source candidate** — potentially relevant official material.
- **Verified evidence** — only source/document text actually retrieved/confirmed.

No fake fallback case is created when a case ID is missing.

## M1.6 Persistence / integration
- Versioned local draft persistence.
- Local completed-case persistence.
- Optional anonymous authenticated Supabase persistence when public project configuration is supplied.
- `POST /api/triage` forwards to Member 2 when configured and safely falls back to deterministic demo triage.
- `POST /api/legal-search` forwards to Member 4 when configured and falls back to explicit metadata-only discovery.

---

# Member 4 — Pakistan Legal Research / RAG

## M4.1 Corpus governance
### Canonical structure
```text
pakistan_legal_corpus/
├── constitution/
├── federal_laws/
├── sindh_laws/
├── supreme_court/
├── high_courts/
│   ├── sindh/
│   ├── lahore/
│   └── islamabad/
├── metadata/
│   └── legal_documents.csv
└── sources.md
```

### Source states
- `placeholder`: quarantined; never evidence.
- `metadata_only`: official source identity known but no direct file/text verified.
- `source_url_verified`: direct official PDF endpoint verified; not yet ingested.
- `ingested`: source text exists in chunk store.

### Current starter state
- 35 total manifest records.
- 5 SHC placeholders quarantined.
- 13 direct official Pakistan Code PDF endpoints verified in the manifest.
- Remaining records stay metadata-only until individually verified.

## M4.2 Acquisition
`scripts/fetch_initial_official_docs.py`
- Selects only `source_url_verified` direct PDFs.
- Enforces official-domain allowlist.
- Requires `%PDF` response signature.
- Never substitutes unofficial mirrors.
- Exits non-zero on failure.

## M4.3 Extraction and chunking
`scripts/ingest_corpus.py`
- Finds only PDFs physically present in corpus folders.
- Uses `pypdf` per page.
- Normalizes text.
- Chunks page-by-page with overlap.
- Attaches document metadata + page number + source URL + source tier; judgment records also retain bench metadata.
- Detects simple Section/Article hints without claiming perfect legal-structure parsing.
- Adds SHA-256 content hashes.
- Produces `data/rag_index/legal_chunks.jsonl`.

## M4.4 Supabase / pgvector
Migration `003_member4_legal_rag.sql` creates:
- `legal_chunks`.
- full-text `tsvector` column + GIN index.
- optional `vector(384)` embeddings + HNSW index.
- server-only corpus mutation permissions.
- lexical search RPC.
- optional semantic match RPC.

`legal_documents` remains the document-level provenance registry.

## M4.5 Retrieval service
`services/legal-rag/app.py`

### Endpoints
- `GET /health`
- `POST /v1/search`

### Retrieval order
1. Supabase ingested chunk search when server configuration exists.
2. Local ingested JSONL chunks.
3. Metadata-only discovery with explicit warning.

The fallback cannot return placeholder SHC records.

## M4.6 Supabase synchronization
`scripts/push_chunks_to_supabase.py`
- Refuses an empty chunk index.
- Upserts chunks in batches.
- Uses server secret only.
- Marks only documents represented in real chunks as `ingested` after successful upload.

## M4.7 Embeddings / hybrid phase
For the hackathon, lexical chunk search is the reliable baseline. The schema already supports 384-dimensional embeddings. Add a real embedding provider only when the team chooses one and can reproduce its model/dimension consistently. Do not generate placeholder/random vectors.

Future hybrid ranking should combine lexical + vector scores, deduplicate by document/section and retain provenance.

## M4.8 Expansion to ~100 documents
After the pipeline is stable:
1. Finish the priority federal Acts with verified direct official files.
2. Resolve 20 Sindh Acts from Sindh Code.
3. Replace all placeholder judgment rows with real court metadata.
4. Add 20 Supreme Court judgments from official court sources.
5. Add 30 real SHC judgments.
6. Add 9 selected other High Court judgments.
7. Re-run corpus checks before every ingestion.

---

# Integration contract

```text
Citizen UI
   │
   ├── /api/triage ─────────────→ Member 2 triage
   │
   └── /api/legal-search ───────→ Member 4 FastAPI
                                      │
                                      ├── Supabase legal_chunks
                                      ├── local legal_chunks.jsonl
                                      └── safe metadata fallback
```

Member 1 renders `evidence_level=metadata` as a source candidate and `evidence_level=chunk` as retrieved source text. It must not upgrade one state into the other.

---

# Challenge-everything quality gate
After every feature, ask:
1. Does this match the requested cinematic/legal-tech goal or merely the easiest implementation?
2. Does the UI imply a capability that is mocked or unavailable?
3. Can a citizen mistake AI organization for verified law?
4. Does mobile retain hierarchy without requiring the full desktop motion model?
5. Is reduced-motion still usable?
6. Are errors explicit and recoverable?
7. Are secrets strictly server-side?
8. Can a placeholder or metadata-only record leak into evidence?
9. Does database status accurately match ingestion reality?
10. Can another teammate test this module without knowing its internals?
11. Does every legal result retain document ID, title, authority and original source URL?
12. Does the fallback fail safely if official websites, Supabase or the AI backend are unavailable?

# Release acceptance criteria
- `npm run test:core` passes.
- strict project-owned TypeScript validation passes.
- Python compile/tests pass.
- Member 4 `/health` and `/v1/search` smoke tests pass.
- `npm run build` passes on a machine with installed Next.js dependencies.
- No secret keys in browser variables.
- No placeholders in evidence retrieval.
- No fabricated case fallback.
- No exact legal provision claim from metadata-only search.
