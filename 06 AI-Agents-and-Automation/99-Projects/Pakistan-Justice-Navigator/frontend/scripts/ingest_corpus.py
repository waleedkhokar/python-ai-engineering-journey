from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SERVICE_DIR = ROOT / "services" / "legal-rag"
import sys
sys.path.insert(0, str(SERVICE_DIR))
from core import chunk_text, write_jsonl  # noqa: E402

MANIFEST = ROOT / "data" / "member4_manifest.csv"
INDEX = ROOT / "data" / "rag_index" / "legal_chunks.jsonl"
CORPUS = ROOT / "pakistan_legal_corpus"


def find_pdf(file_name: str) -> Path | None:
    if not file_name:
        return None
    matches = list(CORPUS.rglob(file_name))
    return matches[0] if matches else None


def extract_pages(path: Path) -> list[tuple[int, str]]:
    reader = PdfReader(str(path))
    pages = []
    for idx, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        if text.strip():
            pages.append((idx, text))
    return pages


def build_rows() -> list[dict]:
    output: list[dict] = []
    with MANIFEST.open(encoding="utf-8") as handle:
        for meta in csv.DictReader(handle):
            if meta["status"] == "placeholder":
                continue
            pdf = find_pdf(meta["file_name"])
            if not pdf:
                continue
            for page_no, text in extract_pages(pdf):
                for chunk in chunk_text(text, target_words=330, overlap_words=45):
                    output.append({
                        "chunk_id": f"{meta['document_id']}-p{page_no:04d}-c{chunk['chunk_index']:03d}",
                        "document_id": meta["document_id"], "title": meta["title"], "document_type": meta["document_type"],
                        "jurisdiction": meta["jurisdiction"], "court": meta["court"], "bench": meta["bench"], "authority": meta["authority"],
                        "citation": meta["citation"], "section_or_article": chunk["section_or_article"],
                        "page_start": page_no, "page_end": page_no, "source_name": meta["source_name"], "source_url": meta["source_url"],
                        "source_tier": int(meta["source_tier"] or 1), "content": chunk["content"], "content_hash": chunk["content_hash"],
                        "embedding": None
                    })
    return output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--summary", action="store_true")
    args = parser.parse_args()
    rows = build_rows()
    count = write_jsonl(INDEX, rows)
    docs = sorted({row["document_id"] for row in rows})
    print(json.dumps({"chunks": count, "documents": docs, "index": str(INDEX.relative_to(ROOT))}, indent=2))
    if not rows:
        print("No PDFs were ingested. Run scripts/fetch_initial_official_docs.py first or place verified official PDFs in pakistan_legal_corpus/.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
