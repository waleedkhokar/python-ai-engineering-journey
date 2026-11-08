# Member 1 ↔ Member 2 / Member 4 API Contract

The citizen frontend stays usable even while the team services are being integrated. Every fallback is explicit so the UI never silently upgrades metadata into legal evidence.

## 1. Triage — Member 2

Frontend route: `POST /api/triage`

The Next.js route either forwards to `BACKEND_API_URL/api/v1/triage` (mapping the request and response to the shapes below) or uses the deterministic demo triage engine.

### Request
```json
{
  "description": "Mere chacha inherited property par qabza kiye hue hain...",
  "language": "roman-ur"
}
```

Allowed languages: `en`, `roman-ur`, `ur`.

### Response
```json
{
  "mode": "backend",
  "category": "Property / inheritance",
  "summary": "Short citizen-friendly summary",
  "urgency": "medium",
  "facts": ["Citizen-provided fact only"],
  "legalIssues": ["Ownership or inheritance basis", "Possession"],
  "missingInformation": ["Who is shown as owner in the latest record?"],
  "suggestedDocuments": ["Registry / ownership document", "Legal notice"],
  "followUpQuestions": [
    {"id": "q1", "prompt": "Who is shown as owner in the latest document you have?", "type": "text"}
  ],
  "sourceIds": ["PK-009", "PK-010"],
  "guardrail": "Preliminary informational triage — not a final legal opinion."
}
```

## 2. Legal search — Member 4

Frontend route: `POST /api/legal-search`

When `LEGAL_RAG_API_URL` is configured, Next.js forwards to `LEGAL_RAG_API_URL/v1/search`. If the service is unavailable, Next.js falls back to title/metadata discovery and returns a warning.

### Request
```json
{
  "query": "inherited property possession",
  "limit": 6
}
```

### Response — ingested source text
```json
{
  "query": "inherited property possession",
  "mode": "local-ingested-chunks",
  "results": [
    {
      "document_id": "PK-009",
      "title": "Transfer of Property Act, 1882",
      "jurisdiction": "Federal",
      "authority": "Parliament of Pakistan",
      "court": "",
      "bench": "",
      "section_or_article": "Section ...",
      "source_url": "official URL",
      "page_start": 12,
      "page_end": 12,
      "score": 8.2,
      "evidence_level": "chunk",
      "snippet": "source-grounded excerpt"
    }
  ]
}
```

### Response — safe metadata fallback
```json
{
  "query": "inherited property possession",
  "mode": "metadata-only",
  "warning": "No ingested chunk index is available yet. Results identify source documents only and do not assert exact legal provisions.",
  "results": [
    {
      "document_id": "PK-009",
      "title": "Transfer of Property Act, 1882",
      "source_url": "official URL",
      "bench": "",
      "evidence_level": "metadata",
      "section_or_article": "",
      "snippet": "Metadata match only — ingest the official document before claiming an exact provision."
    }
  ]
}
```

Member 1 must never manufacture `section_or_article`, citation, bench, case number or quote. Those values must come from verified source metadata/chunks.

## 3. Member 4 health

`GET /health`

```json
{
  "ok": true,
  "index_file_present": true,
  "index_ready": false,
  "local_chunk_count": 0,
  "supabase_configured": false
}
```

`index_ready=false` is intentional until at least one real official source chunk exists.

## 4. Document intelligence — Member 3 handoff

Recommended endpoint: `POST /v1/cases/{case_id}/documents`

```json
{
  "document_id": "uuid",
  "document_type": "Legal Notice",
  "status": "analyzed",
  "parties": [],
  "important_dates": [],
  "deadlines": [],
  "extracted_facts": [],
  "source_file_name": "notice.pdf"
}
```

The citizen UI already has selected/uploaded/processing/analyzed/failed document states and should only show `analyzed` after the service confirms it.
