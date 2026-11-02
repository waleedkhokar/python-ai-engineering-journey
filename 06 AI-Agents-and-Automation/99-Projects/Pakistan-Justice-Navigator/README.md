# Pakistan Justice Navigator

Pakistan Justice Navigator is an AI-assisted legal understanding and case-preparation product for Pakistani legal contexts. It helps people explain a situation in their own words, organise facts, explore potentially relevant legal context, work with documents, and prepare better questions for a qualified legal professional.

> This project provides informational and preparation assistance. It is not legal representation, professional legal advice, or a guarantee of any legal outcome.

## Repository structure

```text
frontend/                  Next.js citizen experience and legal research UI
backend/                   FastAPI triage API
frontend/services/legal-rag/  Official-source research service
frontend/data/              Corpus and member manifests
frontend/supabase/          Database migrations and seed data
docs/                      Product, API, setup, and verification documentation
```

## Frontend quick start

Requirements:

- Node.js
- npm
- Python for the corpus checks used by the project scripts

```powershell
cd frontend
npm install
npm run dev
```

Open <http://localhost:3000>.

Useful commands:

```powershell
npm run typecheck
npm run build
npm run test:core
npm run check
```

## Optional services

The frontend can use the following services when configured:

- `BACKEND_API_URL` — triage API
- `LEGAL_RAG_API_URL` — official legal research service
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — browser-safe Supabase values

Keep LLM credentials and Supabase service-role keys server-side. Never put secrets in `NEXT_PUBLIC_*` variables.

### Backend triage API

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

The API documentation is available at <http://localhost:8001/docs>.

### Legal research service

The official-source research foundation lives in `frontend/services/legal-rag`. Its setup, corpus acquisition, provenance rules, and ingestion workflow are documented in:

- [Member 4 setup](./frontend/docs/MEMBER4_SETUP.md)
- [Master implementation plan](./frontend/docs/MASTER_IMPLEMENTATION_PLAN.md)
- [Team commands](./frontend/docs/TEAM_COMMANDS.md)

## Product experience

The landing page uses a warm editorial legal design system:

- Scroll-linked hero and product storytelling
- Bronze legal-object imagery with transparent cutouts
- A globe identity visual in the `LEGAL / AGENT` transition
- A pinned video story with five scroll-controlled parchment cards
- Responsive desktop and mobile layouts
- Reduced-motion support
- Accessible semantic sections, navigation, focus states, and image descriptions

Runtime media is stored in `frontend/public`:

```text
frontend/public/references/
  books-gavel.webp
  fist-scales.webp
  legal-agent-globe.webp
  story-card.webp
frontend/public/video/
  legal-story.mp4
```

## Legal-information safety principles

The product should:

- Say “helps you understand”, “supports research”, and “potentially relevant”
- Preserve the distinction between user-provided facts, AI organisation, source candidates, and verified evidence
- Keep source identity visible where legal material is presented
- Encourage professional review for important decisions

The product must not claim guaranteed accuracy, guaranteed outcomes, official government advice, or that it replaces a lawyer.

## Documentation

The integrated implementation documentation is available in [frontend/README.md](./frontend/README.md). It includes the current corpus state, Supabase migrations, environment boundaries, and the full verification workflow.

