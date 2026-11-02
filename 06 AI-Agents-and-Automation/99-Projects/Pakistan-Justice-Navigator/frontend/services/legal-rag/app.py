from __future__ import annotations

import csv
import os
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from core import lexical_score, search_jsonl

ROOT = Path(__file__).resolve().parents[2]
INDEX_PATH = ROOT / "data" / "rag_index" / "legal_chunks.jsonl"
MANIFEST_PATH = ROOT / "data" / "member4_manifest.csv"

app = FastAPI(title="Pakistan Justice Navigator — Legal RAG", version="0.1.0")


class SearchRequest(BaseModel):
    query: str = Field(min_length=3, max_length=1200)
    limit: int = Field(default=6, ge=1, le=10)


def metadata_fallback(query: str, limit: int) -> list[dict[str, Any]]:
    rows: list[tuple[float, dict[str, str]]] = []
    with MANIFEST_PATH.open(encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            if row["status"] == "placeholder":
                continue
            score = lexical_score(query, " ".join([row["title"], row["document_type"], row["jurisdiction"], row["authority"], row["source_name"]]))
            if score > 0:
                rows.append((score, row))
    rows.sort(key=lambda item: item[0], reverse=True)
    return [{
        "document_id": row["document_id"], "title": row["title"], "document_type": row["document_type"],
        "jurisdiction": row["jurisdiction"], "authority": row["authority"], "court": row["court"], "bench": row["bench"],
        "citation": row["citation"], "source_name": row["source_name"], "source_url": row["source_url"],
        "section_or_article": row["section_or_article"], "status": row["status"], "score": score,
        "evidence_level": "metadata", "snippet": "Metadata match only — ingest the official document before claiming an exact provision."
    } for score, row in rows[:limit]]


async def supabase_lexical_search(query: str, limit: int) -> list[dict[str, Any]] | None:
    url = os.getenv("SUPABASE_URL", "").rstrip("/")
    secret = os.getenv("SUPABASE_SECRET_KEY", "")
    if not url or not secret:
        return None
    headers = {"apikey": secret, "authorization": f"Bearer {secret}", "content-type": "application/json"}
    async with httpx.AsyncClient(timeout=12) as client:
        response = await client.post(f"{url}/rest/v1/rpc/search_legal_chunks_lexical", headers=headers, json={"query_text": query, "match_count": limit})
        if response.status_code >= 400:
            return None
        rows = response.json()
    return [{**row, "evidence_level": "chunk", "status": "ingested"} for row in rows]


def local_index_count() -> int:
    if not INDEX_PATH.exists():
        return 0
    with INDEX_PATH.open(encoding="utf-8") as handle:
        return sum(1 for line in handle if line.strip())


@app.get("/health")
def health() -> dict[str, Any]:
    chunks = local_index_count()
    return {
        "ok": True,
        "index_file_present": INDEX_PATH.exists(),
        "index_ready": chunks > 0,
        "local_chunk_count": chunks,
        "supabase_configured": bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SECRET_KEY")),
    }


@app.post("/v1/search")
async def search(request: SearchRequest) -> dict[str, Any]:
    query = request.query.strip()
    if len(query) < 3:
        raise HTTPException(400, "Query is too short")

    remote = await supabase_lexical_search(query, request.limit)
    if remote:
        return {"query": query, "mode": "supabase-lexical", "results": remote}

    local = search_jsonl(INDEX_PATH, query, request.limit)
    if local:
        return {"query": query, "mode": "local-ingested-chunks", "results": local}

    return {
        "query": query,
        "mode": "metadata-only",
        "results": metadata_fallback(query, request.limit),
        "warning": "No ingested chunk index is available yet. Results identify source documents only and do not assert exact legal provisions."
    }
