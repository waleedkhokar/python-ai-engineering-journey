from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import StreamingResponse
import shutil
import os
import uuid

from app.services.pdf_processor import extract_pdf_chunks
from app.services.gemini_rag import store_doc_chunks, stream_rag_answer

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")
    
    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}.pdf")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Extract & Store Chunks
    chunks = extract_pdf_chunks(file_path)
    store_doc_chunks(doc_id, chunks)
    
    return {"doc_id": doc_id, "filename": file.filename, "status": "processed"}

@router.post("/chat")
async def chat_with_doc(doc_id: str, question: str):
    return StreamingResponse(
        stream_rag_answer(doc_id, question),
        media_type="text/event-stream"
    )