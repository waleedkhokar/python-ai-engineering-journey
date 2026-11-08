# Corpus folders

- `constitution/` — official Constitution source files
- `federal_laws/` — federal Acts / Codes from Pakistan Code
- `sindh_laws/` — Sindh legislation from Sindh Code
- `supreme_court/` — reserved for official Supreme Court judgments
- `high_courts/` — official High Court judgments grouped by court
- `metadata/legal_documents.csv` — source register used by ingestion

The repository intentionally does not ship fabricated PDFs. Run `python scripts/fetch_initial_official_docs.py` to download the first verified direct official PDFs when network access is available.
