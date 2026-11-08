"""Orchestrates parsing, matching, scoring, and feedback into one analysis."""
from __future__ import annotations

from datetime import datetime, timezone
from functools import lru_cache

from app.schemas import AnalysisResponse, ResumeParsed
from app.services.ats_scorer import ATSScorer
from app.services.feedback_generator import FeedbackGenerator
from app.services.job_parser import JobDescriptionParser
from app.services.resume_parser import ResumeParser
from app.services.skill_matcher import SkillMatcher


@lru_cache(maxsize=1)
def get_resume_parser() -> ResumeParser:
    return ResumeParser()


@lru_cache(maxsize=1)
def get_skill_matcher() -> SkillMatcher:
    return SkillMatcher()


def run_analysis(resume: ResumeParsed, resume_text: str, job_text: str) -> AnalysisResponse:
    job = JobDescriptionParser().parse(job_text)
    comparison = get_skill_matcher().compare(
        resume.skills, job.required_skills, job.nice_to_have_skills
    )
    ats = ATSScorer().score(resume, job, resume_text, comparison.match_percentage)
    feedback = FeedbackGenerator().generate(resume, job, comparison, ats.overall_score, resume_text)
    return AnalysisResponse(
        resume=resume,
        job_description=job,
        skill_comparison=comparison,
        ats_score=ats,
        feedback=feedback,
        generated_at=datetime.now(timezone.utc),
    )
