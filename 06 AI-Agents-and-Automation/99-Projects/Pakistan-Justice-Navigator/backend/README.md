# Member 2 — AI Legal Triage

Self-contained FastAPI module for the Pakistan Justice Navigator hackathon.

## Responsibility
Input: citizen problem + language + optional facts/documents/timeline/legal sources.
Output: category, issues, urgency, facts, missing facts, follow-up questions, possible pathways, warnings, and grounded source IDs.

This is intake/triage, not a final legal opinion.

## Run
```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8001
```

Swagger: http://localhost:8001/docs

## Environment
```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=
LLM_MODEL=
LLM_TIMEOUT_SECONDS=30
```

If LLM credentials are absent, the service uses a deterministic development fallback.

## API
POST `/api/v1/triage`

```json
{
  "message": "Mere chacha ne hamari inherited property par qabza kar liya hai.",
  "language": "roman_urdu",
  "known_facts": [],
  "documents": [],
  "timeline": [],
  "legal_sources": []
}
```

Member 6 can mount this router into the shared FastAPI backend or deploy it as an internal service. Browser code must never call the LLM provider directly.
