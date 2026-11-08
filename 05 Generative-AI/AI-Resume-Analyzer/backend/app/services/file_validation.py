"""Validation for uploaded resume files."""
from pathlib import PurePath

from fastapi import HTTPException, UploadFile, status

from app.config import settings

# Expected leading bytes for each allowed extension.
# PDF files start with "%PDF"; DOCX files are ZIP archives ("PK").
MAGIC_BYTES: dict[str, bytes] = {"pdf": b"%PDF", "docx": b"PK\x03\x04"}


async def read_resume_upload(file: UploadFile) -> tuple[bytes, str]:
    """Read and validate an uploaded resume. Returns (content, extension)."""
    extension = PurePath(file.filename or "").suffix.lower().lstrip(".")
    if extension not in MAGIC_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Upload a PDF or DOCX file.",
        )

    content = await file.read(settings.max_upload_bytes + 1)
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty.")
    if len(content) > settings.max_upload_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File is larger than {settings.max_upload_bytes // (1024 * 1024)} MB.",
        )
    if not content.startswith(MAGIC_BYTES[extension]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File content does not match its extension.",
        )
    return content, extension
