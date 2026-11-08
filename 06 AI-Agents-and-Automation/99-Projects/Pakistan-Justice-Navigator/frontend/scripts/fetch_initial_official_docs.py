from __future__ import annotations

import csv
import sys
from pathlib import Path
from urllib.parse import urlparse

import httpx

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "member4_manifest.csv"
CORPUS = ROOT / "pakistan_legal_corpus"
ALLOWED = {"pakistancode.gov.pk", "www.pakistancode.gov.pk", "sindhlaws.gov.pk", "www.sindhlaws.gov.pk", "caselaw.shc.gov.pk"}

def destination(row: dict[str, str]) -> Path:
    document_id = row["document_id"].upper()
    document_type = row["document_type"].lower()
    court = row["court"].lower()
    jurisdiction = row["jurisdiction"].lower()

    if document_id == "PK-001" or "constitution" in document_type:
        folder = CORPUS / "constitution"
    elif document_id.startswith("SD-") or "sindh" in jurisdiction and not court:
        folder = CORPUS / "sindh_laws"
    elif "supreme court" in court:
        folder = CORPUS / "supreme_court"
    elif "sindh high court" in court:
        folder = CORPUS / "high_courts" / "sindh"
    elif "lahore high court" in court:
        folder = CORPUS / "high_courts" / "lahore"
    elif "islamabad high court" in court:
        folder = CORPUS / "high_courts" / "islamabad"
    else:
        folder = CORPUS / "federal_laws"

    return folder / row["file_name"]


def main() -> int:
    with MANIFEST.open(encoding="utf-8") as handle:
        rows = [row for row in csv.DictReader(handle) if row["status"] == "source_url_verified" and row["source_url"].lower().endswith(".pdf")]

    failures = 0
    with httpx.Client(timeout=45, follow_redirects=True, headers={"User-Agent": "PakistanJusticeNavigator/0.1 research-corpus"}) as client:
        for row in rows:
            host = (urlparse(row["source_url"]).hostname or "").lower()
            if host not in ALLOWED:
                print(f"BLOCKED {row['document_id']}: non-official host {host}")
                failures += 1
                continue
            path = destination(row)
            path.parent.mkdir(parents=True, exist_ok=True)
            try:
                response = client.get(row["source_url"])
                response.raise_for_status()
                if not response.content.startswith(b"%PDF"):
                    raise RuntimeError("response is not a PDF")
                path.write_bytes(response.content)
                print(f"OK {row['document_id']} -> {path.relative_to(ROOT)} ({len(response.content):,} bytes)")
            except Exception as exc:
                failures += 1
                print(f"FAIL {row['document_id']}: {exc}")
    if failures:
        print("Some downloads failed. Do not create substitute files from unofficial sources.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
