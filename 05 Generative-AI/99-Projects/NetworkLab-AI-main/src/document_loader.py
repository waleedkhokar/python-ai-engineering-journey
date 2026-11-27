from __future__ import annotations

from pathlib import Path
from typing import BinaryIO


def extract_document(uploaded_file) -> list[dict]:
    """
    Extract a document into page-aware records.
    Each record contains a 1-based page number and extracted text.
    TXT files are represented as one logical page.
    """
    filename = getattr(uploaded_file, "name", "uploaded-document").lower()
    if filename.endswith(".pdf"):
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise RuntimeError("Install pypdf: python -m pip install pypdf") from exc
        reader = PdfReader(uploaded_file)
        pages = []
        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            if text.strip():
                pages.append({"page": page_number, "text": text})
    elif filename.endswith(".txt"):
        raw = uploaded_file.getvalue()
        pages = [{"page": 1, "text": raw.decode("utf-8", errors="replace")}]
    else:
        raise ValueError("Supported formats are PDF and TXT.")

    if not pages:
        raise ValueError(
            "No selectable text was found. If this is a scanned PDF, run OCR first; OCR is not built into this version."
        )
    return pages
