# Team Handoff — Integrated v0.5

## Member 1 — Citizen Experience

Own the public experience and frontend integration states. The landing page is a cinematic parallax narrative, while login/dashboard/intake/results remain usable product surfaces. Preserve the four provenance states: citizen-reported, AI-organized, source candidate, verified evidence.

## Member 2 — Triage / LLM

Implement the structured `POST /v1/triage` contract described in `docs/API_CONTRACT.md`. Return structured fields rather than free-form legal conclusions. Never manufacture a section, court citation, deadline or document-derived fact.

## Member 3 — Document Intelligence

Return explicit file states (`uploaded`, `processing`, `analyzed`, `failed`) and extracted fields with page/source context. A browser-selected file is not an analyzed file. Document-derived facts should carry document/page provenance.

## Member 4 — Official Legal Research / RAG

Own `data/member4_manifest.csv`, `pakistan_legal_corpus/`, ingestion, `legal_chunks`, Supabase retrieval and `services/legal-rag`. Keep placeholder records quarantined. A metadata-only match is a discovery result, not evidence. Every chunk must retain document ID/title/authority/original URL/page and source tier.

## Lawyer workspace owner

Consume the completed `CaseDraft` and verified source/document outputs. Do not collapse provenance states when generating the lawyer brief.

## Integration owner

Run the complete merge gate before a demo or merge:

```powershell
npm install
npm run test:core
npm run typecheck
npm run build
python -m compileall services\legal-rag scripts
```

Keep `SUPABASE_SECRET_KEY`, service-role credentials and LLM secrets server-side only.
