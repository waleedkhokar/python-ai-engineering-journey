# Implementation Challenge Log

This log records the deliberate “question what we just built” pass requested for the project.

| Module | Question challenged | Finding | Fix | Status |
|---|---|---|---|---|
| Landing | Is it truly cinematic or just animated cards? | Earlier layout still read as a conventional landing page. | Rebuilt as sticky full-viewport scenes with scroll-linked 3D depth. | Fixed |
| Landing | Does it feel alive when the user is not scrolling? | Scroll movement alone felt static at rest. | Added restrained pointer-reactive hero perspective for desktop pointers. | Fixed |
| Landing | Is motion accessible? | Pinned scenes could be uncomfortable for reduced-motion users. | Added `prefers-reduced-motion` flattening to normal document flow. | Fixed |
| Login | Are we pretending to have production auth? | A conventional password form would be deceptive. | Demo access uses name/email only and labels its demo/local behavior. | Fixed |
| Login | Is internal architecture exposed? | Copy previously mentioned production Supabase wiring. | Removed framework/database implementation wording from citizen copy. | Fixed |
| Dashboard | Does it belong to the same visual world as the landing? | Initial dashboard was too flat. | Added restrained architectural depth, elevated metrics and motion hierarchy. | Fixed |
| Dashboard | Is the research entry developer-facing? | “Legal Research Lab / Test retrieval” sounded internal. | Renamed to Official Legal Research with citizen-facing provenance copy. | Fixed |
| Intake | Can changing language destroy work? | Potential UX risk. | Language is part of draft state; switching does not clear answers. | Fixed |
| Intake | Can a selected file look analyzed? | Dangerous legal-product implication. | Separate selected/uploaded/processing/analyzed/failed statuses. | Fixed |
| Results | What if a case ID does not exist? | Earlier version silently used a fake case. | Proper case-not-found state; no fabricated fallback. | Fixed |
| Results | Can AI output look legally verified? | Earlier hierarchy did not strongly distinguish provenance. | Four-state provenance model: reported / organized / candidate / verified. | Fixed |
| Corpus | Are starter judgments real? | Five SHC rows are placeholders. | Quarantined by status and excluded from retrieval/search evidence. | Fixed |
| Corpus | Does “official source” mean the PDF is actually known? | Most starter URLs were generic portal URLs. | Individually verified direct official PDF endpoints where possible; now 13 direct Pakistan Code PDFs in manifest. | Fixed |
| Corpus | What happens if official download fails? | Risk of replacing with unofficial mirrors. | Downloader fails non-zero and explicitly forbids substitute files. | Fixed |
| Ingestion | Does an empty index look ready? | Empty JSONL existed and health could have been misleading. | `index_ready` now depends on real non-empty chunk count. | Fixed + tested |
| Retrieval | Are we calling metadata search “RAG”? | That would overstate capability. | Three explicit modes: Supabase chunks / local chunks / metadata-only. | Fixed |
| Retrieval | Do we need embeddings to demo safely? | Forcing embeddings adds fragility and invites fake vectors. | Lexical retrieval is baseline; vector path is optional and only for real embeddings. | Fixed |
| Supabase | Can browser users mutate the corpus? | Corpus integrity requires server ownership. | RLS/grants keep chunk writes server-only. | Fixed |
| Supabase | Can seed and manifest drift? | Seed used older generic URLs/statuses. | Seed regenerated from canonical Member 4 manifest and checked in tests. | Fixed + tested |
| Supabase | After chunk upload does document status remain stale? | Yes, previously it could. | Chunk push marks only successfully represented documents `ingested`. | Fixed |
| API | Can a placeholder leak through metadata fallback? | Needed explicit test coverage. | Added FastAPI contract test asserting no `SHC-*` placeholders in fallback. | Fixed + tested |
| Acquisition | Will future verified Sindh Acts or judgments be routed into the correct corpus folder? | Downloader originally defaulted every non-Constitution source to `federal_laws`. | Added metadata-aware routing for Sindh laws, Supreme Court and major High Court folders. | Fixed + tested |
| Judgment metadata | Will official judgment bench information survive ingestion and retrieval? | The manifest had a `bench` field but the database/chunk/search contract did not preserve it. | Added bench end-to-end in `legal_documents`, `legal_chunks`, seed, ingestion, FastAPI, frontend type and research provenance UI. | Fixed + tested |
| Build | Can this sandbox perform a genuine Next build? | npm registry DNS/network is unavailable here. | Kept dependency versions unchanged, ran strict local TS shim validation; local machine must run real `npm install/typecheck/build`. | Environment limitation documented |
