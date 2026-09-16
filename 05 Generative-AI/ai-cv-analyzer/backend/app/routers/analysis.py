import time
from typing import List
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from google.api_core.exceptions import ServiceUnavailable, ResourceExhausted
from app.schemas.analysis_schema import CVAnalysisResponse
from app.services.gemini_service import GeminiService
from app.services.parser_service import ParserService

router = APIRouter(prefix="/api/v1", tags=["Analysis"])

# Initialize Gemini service instance
gemini_service = GeminiService()


@router.post("/analyze", response_model=CVAnalysisResponse)
async def analyze_cv_endpoint(
    job_description: str = Form(..., description="The target Job Description text"),
    file: UploadFile = File(
        ..., description="The CV file upload (PDF or DOCX)"
    ),
):
  try:
    file_bytes = await file.read()
    if not file_bytes:
      raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    cv_text = ParserService.extract_text(file_bytes, file.filename)
    if not cv_text or len(cv_text.strip()) < 50:
      raise HTTPException(
          status_code=400,
          detail="Could not extract sufficient text from the file. Please check the file format.",
      )

    max_retries = 4
    delay_seconds = 3
    analysis_result = None

    for attempt in range(max_retries):
      try:
        analysis_result = gemini_service.analyze_cv(cv_text, job_description)
        break
      except Exception as e:
        err_msg = str(e)
        is_server_busy = "503" in err_msg or "UNAVAILABLE" in err_msg or "ResourceExhausted" in err_msg or "429" in err_msg
        
        if is_server_busy and attempt < max_retries - 1:
          time.sleep(delay_seconds)
          delay_seconds *= 2  # Exponential backoff (3s -> 6s -> 12s)
        else:
          if attempt == max_retries - 1:
            raise HTTPException(
                status_code=503,
                detail="AI model is currently experiencing high demand. Please try again shortly."
            )
          raise e

    return analysis_result

  except ValueError as ve:
    raise HTTPException(status_code=400, detail=str(ve))
  except HTTPException as he:
    raise he
  except Exception as e:
    raise HTTPException(
        status_code=500, detail=f"An error occurred during analysis: {str(e)}"
    )


@router.post("/analyze-batch", response_model=List[CVAnalysisResponse])
async def analyze_batch_cvs(
    job_description: str = Form(..., description="The target Job Description text"),
    files: List[UploadFile] = File(..., description="Multiple CV files upload")
):
  if len(files) > 15:
    raise HTTPException(status_code=400, detail="Maximum 15 CVs allowed per batch.")
  
  batch_results = []
  
  for index, file in enumerate(files):
    file_bytes = await file.read()
    if not file_bytes:
      continue
        
    cv_text = ParserService.extract_text(file_bytes, file.filename)
    if not cv_text or len(cv_text.strip()) < 50:
      continue
        
    max_retries = 4
    delay_seconds = 3
    analysis_result = None

    for attempt in range(max_retries):
      try:
        analysis_result = gemini_service.analyze_cv(cv_text, job_description)
        analysis_result.filename = file.filename
        break
      except Exception as e:
        err_msg = str(e)
        is_server_busy = "503" in err_msg or "UNAVAILABLE" in err_msg or "ResourceExhausted" in err_msg or "429" in err_msg
        if is_server_busy and attempt < max_retries - 1:
          time.sleep(delay_seconds)
          delay_seconds *= 2
        else:
          if attempt == max_retries - 1:
            # Skip this particular failed file rather than crashing the whole 10-CV batch
            break
          raise e

    if analysis_result:
      batch_results.append(analysis_result)
    
    # Add a gentle 1.5 second pacing gap between consecutive candidate requests to prevent hitting Google rate limits
    if index < len(files) - 1:
      time.sleep(1.5)
        
  if not batch_results:
    raise HTTPException(
        status_code=503, 
        detail="AI service is busy or rate-limited. Please try a smaller batch or try again in a moment."
    )

  batch_results.sort(key=lambda x: x.match_score, reverse=True)
  return batch_results