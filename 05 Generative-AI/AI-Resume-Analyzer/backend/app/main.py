"""AI Resume Analyzer & Job Match Assistant - FastAPI application."""
from __future__ import annotations

import logging
from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.schemas import (
    AnalysisResponse,
    JobDescriptionParsed,
    KeywordGapResponse,
    ResumeParsed,
    SkillComparison,
)
from app.services.analyzer import get_resume_parser, get_skill_matcher, run_analysis
from app.services.file_validation import read_resume_upload
from app.services.job_parser import JobDescriptionParser, keyword_gaps

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("resume_analyzer")

app = FastAPI(
    title="AI Resume Analyzer & Job Match Assistant",
    description="Parses resumes, compares them with job descriptions, and returns an ATS-style score and feedback. Runs locally with open-source models.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _parse_resume_or_422(content: bytes, extension: str) -> tuple[ResumeParsed, str]:
    try:
        return get_resume_parser().parse_file(content, extension)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/parse-job", response_model=JobDescriptionParsed, tags=["parsing"])
def parse_job(job_description: Annotated[str, Form(min_length=20)]) -> JobDescriptionParsed:
    return JobDescriptionParser().parse(job_description)


@app.post("/api/v1/parse-resume", response_model=ResumeParsed, tags=["parsing"])
async def parse_resume(resume_file: Annotated[UploadFile, File()]) -> ResumeParsed:
    content, extension = await read_resume_upload(resume_file)
    parsed, _ = _parse_resume_or_422(content, extension)
    return parsed


@app.post("/api/v1/analyze", response_model=AnalysisResponse, tags=["analysis"])
async def analyze(
    job_description: Annotated[str, Form(min_length=20, description="Full job description text")],
    resume_file: Annotated[UploadFile | None, File(description="PDF or DOCX resume")] = None,
) -> AnalysisResponse:
    if resume_file is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload a resume file.")
    content, extension = await read_resume_upload(resume_file)
    parsed, raw_text = _parse_resume_or_422(content, extension)
    try:
        return run_analysis(parsed, raw_text, job_description)
    except Exception:
        logger.exception("Analysis failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Analysis failed. Please try again.")


@app.post("/api/v1/match-skills", response_model=SkillComparison, tags=["analysis"])
def match_skills(
    resume_skills: Annotated[list[str], Form()],
    required_skills: Annotated[list[str], Form()],
    nice_to_have_skills: Annotated[list[str] | None, Form()] = None,
) -> SkillComparison:
    return get_skill_matcher().compare(resume_skills, required_skills, nice_to_have_skills or [])


@app.post("/api/v1/keywords", response_model=KeywordGapResponse, tags=["analysis"])
def keywords(
    job_description: Annotated[str, Form(min_length=20)],
    resume_skills: Annotated[list[str], Form()],
) -> KeywordGapResponse:
    return KeywordGapResponse(missing_keywords=keyword_gaps(job_description, resume_skills))
