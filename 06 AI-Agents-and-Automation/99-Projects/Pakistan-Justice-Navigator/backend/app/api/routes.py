from io import BytesIO

from fastapi import APIRouter, File, HTTPException, UploadFile
from pypdf import PdfReader

from app.schemas.triage import TriageRequest, TriageResult
from app.services.triage_service import TriageService

router = APIRouter(tags=["legal-triage"])
service = TriageService()


@router.post("/triage", response_model=TriageResult)
async def triage(request: TriageRequest) -> TriageResult:
    try:
        return await service.analyze(request)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="The legal triage service is temporarily unavailable.",
        ) from exc


@router.post("/document")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content = await file.read()
        reader = PdfReader(BytesIO(content))

        pages = []
        for page in reader.pages:
            pages.append(page.extract_text() or "")

        text = "\n\n".join(pages).strip()

        return {
            "filename": file.filename,
            "pages": len(reader.pages),
            "text": text,
            "status": "extracted",
        }

    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not extract text from PDF: {str(exc)}",
        ) from exc