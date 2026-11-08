"""Shared pytest fixtures.

Embeddings are disabled for the test run so tests do not download a model.
Exact skill matching is still exercised.
"""
import io
import os
from pathlib import Path

os.environ.setdefault("USE_EMBEDDINGS", "false")

import pytest  # noqa: E402

SAMPLES = Path(__file__).resolve().parent.parent / "samples"


@pytest.fixture(scope="session")
def sample_resume_text() -> str:
    return (SAMPLES / "sample_resume.txt").read_text(encoding="utf-8")


@pytest.fixture(scope="session")
def sample_job_text() -> str:
    return (SAMPLES / "sample_job_description.txt").read_text(encoding="utf-8")


@pytest.fixture(scope="session")
def spacy_ready() -> None:
    """Skip tests that need the spaCy model when it is not installed."""
    from app.services.resume_parser import _load_spacy

    try:
        _load_spacy()
    except RuntimeError as exc:
        pytest.skip(str(exc))


@pytest.fixture
def make_docx():
    """Factory that builds a DOCX file in memory from plain text lines."""
    from docx import Document

    def _make(text: str) -> bytes:
        document = Document()
        for line in text.splitlines():
            document.add_paragraph(line)
        buffer = io.BytesIO()
        document.save(buffer)
        return buffer.getvalue()

    return _make


@pytest.fixture
def make_pdf():
    """Factory that builds a minimal single-page text PDF from lines of text."""

    def _make(lines: list[str]) -> bytes:
        ops = ["BT", "/F1 11 Tf", "14 TL", "50 760 Td"]
        for line in lines:
            safe = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            ops.append(f"({safe}) Tj T*")
        ops.append("ET")
        stream = "\n".join(ops).encode("latin-1")
        objects = [
            b"<< /Type /Catalog /Pages 2 0 R >>",
            b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
            b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R "
            b"/Resources << /Font << /F1 5 0 R >> >> >>",
            b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
            b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        ]
        out = bytearray(b"%PDF-1.4\n")
        offsets = []
        for number, body in enumerate(objects, start=1):
            offsets.append(len(out))
            out += f"{number} 0 obj\n".encode() + body + b"\nendobj\n"
        xref_at = len(out)
        out += f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode()
        for offset in offsets:
            out += f"{offset:010d} 00000 n \n".encode()
        out += f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_at}\n%%EOF\n".encode()
        return bytes(out)

    return _make
