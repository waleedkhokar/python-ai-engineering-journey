from __future__ import annotations

import hashlib
import json
import math
import re
from collections import Counter
from pathlib import Path
from typing import Iterable

TOKEN_RE = re.compile(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?")
SECTION_RE = re.compile(r"(?mi)^(?:article|section|sec\.|s\.)\s*([0-9]+[A-Za-z]?(?:-[0-9A-Za-z]+)?)\b")


def normalize_text(text: str) -> str:
    text = text.replace("\x00", " ").replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def token_count(text: str) -> int:
    return len(TOKEN_RE.findall(text))


def detect_section(text: str) -> str:
    match = SECTION_RE.search(text[:500])
    return match.group(0).strip() if match else ""


def chunk_text(text: str, target_words: int = 360, overlap_words: int = 60) -> list[dict]:
    """Chunk normalized text without pretending page/section boundaries are exact."""
    clean = normalize_text(text)
    words = clean.split()
    if not words:
        return []
    step = max(1, target_words - overlap_words)
    chunks: list[dict] = []
    for start in range(0, len(words), step):
        piece = words[start : start + target_words]
        if len(piece) < 40 and chunks:
            break
        content = " ".join(piece)
        chunks.append({
            "chunk_index": len(chunks),
            "content": content,
            "section_or_article": detect_section(content),
            "word_count": len(piece),
            "content_hash": hashlib.sha256(content.encode("utf-8")).hexdigest(),
        })
        if start + target_words >= len(words):
            break
    return chunks


def lexical_score(query: str, text: str) -> float:
    q = [token.lower() for token in TOKEN_RE.findall(query) if len(token) > 1]
    if not q:
        return 0.0
    counts = Counter(token.lower() for token in TOKEN_RE.findall(text))
    score = 0.0
    for token in q:
        tf = counts[token]
        if tf:
            score += 1.0 + math.log1p(tf)
    phrase = " ".join(q)
    if phrase and phrase in text.lower():
        score += 4.0
    return round(score, 4)


def search_jsonl(index_path: Path, query: str, limit: int = 6) -> list[dict]:
    if not index_path.exists():
        return []
    scored: list[tuple[float, dict]] = []
    with index_path.open(encoding="utf-8") as handle:
        for line in handle:
            if not line.strip():
                continue
            row = json.loads(line)
            score = lexical_score(query, f"{row.get('title','')} {row.get('content','')}")
            if score > 0:
                scored.append((score, row))
    scored.sort(key=lambda item: item[0], reverse=True)
    results = []
    for score, row in scored[:limit]:
        content = row.get("content", "")
        results.append({
            "document_id": row.get("document_id", ""),
            "title": row.get("title", ""),
            "document_type": row.get("document_type", ""),
            "jurisdiction": row.get("jurisdiction", ""),
            "authority": row.get("authority", ""),
            "court": row.get("court", ""),
            "citation": row.get("citation", ""),
            "source_name": row.get("source_name", ""),
            "source_url": row.get("source_url", ""),
            "section_or_article": row.get("section_or_article", ""),
            "status": "ingested",
            "score": score,
            "evidence_level": "chunk",
            "snippet": content[:520].strip() + ("…" if len(content) > 520 else ""),
        })
    return results


def write_jsonl(path: Path, rows: Iterable[dict]) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
            count += 1
    return count
