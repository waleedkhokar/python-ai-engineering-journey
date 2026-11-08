# AI Resume Analyzer & Job Match Assistant

Upload a resume (PDF or DOCX), paste a job description, and get:

- Contact, experience, education, certification, and project extraction
- Skill matching against the job's required and nice-to-have skills
- An ATS-style compatibility score with a per-section breakdown
- Rule-based feedback: strengths, weaknesses, prioritised suggestions, and wording tips

Everything runs locally with open-source models. No paid APIs are called.

## Tech stack

| Layer | Tools |
|---|---|
| Backend | Python 3.12, FastAPI, Pydantic v2 |
| Parsing | pdfplumber (PDF), python-docx (DOCX), spaCy `en_core_web_sm` (name detection) |
| Matching | Canonical skill vocabulary, sentence-transformers `all-MiniLM-L6-v2` (optional semantic matching) |
| Frontend | React 18, TypeScript, Vite |
| Packaging | Docker, docker-compose |

## Quick start

### Option 1: Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- API docs (Swagger): http://localhost:8000/docs

### Option 2: Run locally

Backend (Python 3.12):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload
```

Frontend (Node 18+), in a second terminal:

```bash
cd frontend
npm install
npm run dev                       # http://localhost:5173
```

The defaults work without any configuration. To change them, set environment variables in your shell (see `backend/.env.example` for the list). The app does not read `.env` files on its own.

The first analysis downloads the embedding model (about 90 MB) once. To skip it, set `USE_EMBEDDINGS=false`. Matching then uses exact skill names only.

The Docker image is large (several GB) because sentence-transformers installs PyTorch. For a smaller image, use `USE_EMBEDDINGS=false` or install a CPU-only PyTorch build before the requirements.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/v1/analyze` | Full analysis. Form fields: `resume_file` (PDF/DOCX), `job_description` |
| POST | `/api/v1/parse-resume` | Parse a resume file only |
| POST | `/api/v1/parse-job` | Parse a job description only |
| POST | `/api/v1/match-skills` | Compare two skill lists |
| POST | `/api/v1/keywords` | List skills in the job description missing from the resume |

Example:

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "resume_file=@backend/samples/sample_resume.docx" \
  -F "job_description=$(cat backend/samples/sample_job_description.txt)"
```

Sample files are in `backend/samples/`: a DOCX resume and the job description text.

## How the scores work

- **Skill match** is the share of required skills found in the resume. Matching uses canonical names and aliases first (for example, "Postgres" counts as "PostgreSQL"). Semantic similarity is a fallback signal.
- **ATS score** is a weighted checklist: contact details (10%), experience (30%), skills match (25%), education (15%), projects (10%), and formatting (10%). It is a transparent heuristic. It does not reproduce any specific applicant tracking system.
- **Feedback** comes from explicit rules, not a language model, so results are predictable and free to run.

## Limitations

- Scanned or image-only PDFs are rejected because no OCR is included.
- Layout problems such as tables and multi-column designs cannot be detected from extracted text.
- Section and entry detection is heuristic. Unusual resume layouts may be parsed less accurately. Check the parsed output in `/api/v1/parse-resume`.
- The skill vocabulary covers 57 common technologies. Add entries to `backend/app/services/skill_vocabulary.py` to extend it.

## Tests

```bash
cd backend
pytest
```

The suite covers the skill vocabulary, job and resume parsers, skill matcher, ATS scorer, and API endpoints, including upload validation. Tests that need the spaCy model are skipped with a clear message if it is not installed.

## Project layout

```
backend/
  app/
    main.py                 FastAPI routes
    config.py               Environment settings
    schemas.py              Pydantic request and response models
    services/
      analyzer.py           Runs the full pipeline
      resume_parser.py      PDF/DOCX text extraction and resume parsing
      job_parser.py         Job description parsing
      skill_vocabulary.py   Canonical skills and aliases
      skill_matcher.py      Exact and semantic skill matching
      ats_scorer.py         ATS-style scoring
      feedback_generator.py Rule-based feedback
      file_validation.py    Upload size and type checks
  tests/                    Pytest suite
  samples/                  Sample resume and job description
frontend/
  src/                      React + TypeScript app
docker-compose.yml
```

## Roadmap

Not yet implemented: user accounts and JWT authentication, saved analysis history (PostgreSQL), PDF report export, emailed reports, an admin dashboard, and OCR for scanned resumes.

## License

MIT. See [LICENSE](LICENSE).
