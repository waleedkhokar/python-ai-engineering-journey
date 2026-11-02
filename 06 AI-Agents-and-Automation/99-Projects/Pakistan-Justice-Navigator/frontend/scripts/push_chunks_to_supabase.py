from __future__ import annotations

import json
import os
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "data" / "rag_index" / "legal_chunks.jsonl"


def main() -> int:
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    secret = os.getenv("SUPABASE_SECRET_KEY", "")
    if not url or not secret:
        raise SystemExit("Set SUPABASE_URL and SUPABASE_SECRET_KEY server-side first.")
    if not INDEX.exists():
        raise SystemExit("No chunk index found. Run scripts/ingest_corpus.py first.")
    rows = [json.loads(line) for line in INDEX.read_text(encoding="utf-8").splitlines() if line.strip()]
    headers = {"apikey": secret, "authorization": f"Bearer {secret}", "content-type": "application/json", "prefer": "resolution=merge-duplicates,return=minimal"}
    if not rows:
        raise SystemExit("Chunk index is empty. Ingest verified official PDFs before pushing to Supabase.")

    with httpx.Client(timeout=30) as client:
        for start in range(0, len(rows), 100):
            batch = rows[start:start+100]
            response = client.post(f"{url}/rest/v1/legal_chunks?on_conflict=chunk_id", headers=headers, json=batch)
            response.raise_for_status()
            print(f"pushed {min(start+100, len(rows))}/{len(rows)}")

        # Keep document-level provenance/status synchronized with the chunk index.
        for document_id in sorted({row["document_id"] for row in rows}):
            response = client.patch(
                f"{url}/rest/v1/legal_documents?document_id=eq.{document_id}",
                headers=headers,
                json={"status": "ingested"},
            )
            response.raise_for_status()
            print(f"marked {document_id} as ingested")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
