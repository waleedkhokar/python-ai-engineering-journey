import io
import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader

from app.services.gemini_rag import store_doc_chunks, stream_rag_answer

app = FastAPI(title="DocuMind AI Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatPayload(BaseModel):
    doc_id: str
    question: str


@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    """Accept PDF, extract text by page, generate embeddings, and store in Qdrant."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    doc_id = str(uuid.uuid4())

    try:
        contents = await file.read()
        pdf_reader = PdfReader(io.BytesIO(contents))
        chunks = []

        for page_num, page in enumerate(pdf_reader.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                chunks.append({
                    "text": text,
                    "metadata": {"page_number": page_num}
                })

        if not chunks:
            raise HTTPException(status_code=400, detail="Could not extract readable text from PDF.")

        # Save embeddings into Qdrant vector store
        store_doc_chunks(doc_id=doc_id, chunks=chunks)

        return JSONResponse(content={
            "doc_id": doc_id,
            "filename": file.filename,
            "total_pages": len(pdf_reader.pages),
            "status": "success"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


@app.post("/api/chat")
async def chat_endpoint(
    doc_id: Optional[str] = Query(None),
    question: Optional[str] = Query(None),
    payload: Optional[ChatPayload] = None,
):
    """
    Stream RAG response. Supports both query parameters (/api/chat?doc_id=...&question=...)
    and JSON body payloads.
    """
    target_doc_id = doc_id or (payload.doc_id if payload else None)
    target_question = question or (payload.question if payload else None)

    if not target_doc_id or not target_question:
        raise HTTPException(status_code=400, detail="Missing required parameters: doc_id and question.")

    return StreamingResponse(
        stream_rag_answer(doc_id=target_doc_id, question=target_question),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )