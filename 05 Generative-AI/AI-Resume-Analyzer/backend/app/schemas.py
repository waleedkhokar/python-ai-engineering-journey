"""Pydantic models used for API requests and responses."""
from datetime import datetime

from pydantic import BaseModel, Field


class ContactInfo(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    linkedin: str | None = None
    github: str | None = None


class Experience(BaseModel):
    company: str = ""
    position: str = ""
    duration: str = ""
    description: str | None = None
    skills: list[str] = Field(default_factory=list)


class Education(BaseModel):
    institution: str = ""
    degree: str = ""
    field: str = ""
    graduation_year: str | None = None


class Certification(BaseModel):
    name: str
    issuer: str = ""
    year: str | None = None


class Project(BaseModel):
    name: str
    description: str | None = None
    technologies: list[str] = Field(default_factory=list)
    link: str | None = None


class ResumeParsed(BaseModel):
    contact_info: ContactInfo = Field(default_factory=ContactInfo)
    summary: str | None = None
    experience: list[Experience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    skills: list[str] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)


class JobDescriptionParsed(BaseModel):
    title: str
    company: str
    summary: str
    required_skills: list[str] = Field(default_factory=list)
    nice_to_have_skills: list[str] = Field(default_factory=list)
    years_experience: int | None = None
    location: str | None = None
    salary_range: str | None = None


class SkillMatch(BaseModel):
    skill: str
    match_score: float = Field(..., ge=0, le=1)
    method: str = Field(..., description="'exact' or 'semantic'")


class SkillComparison(BaseModel):
    matching_skills: list[SkillMatch] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    additional_skills: list[str] = Field(default_factory=list)
    match_percentage: float = Field(..., ge=0, le=100)


class ATSScoreDetail(BaseModel):
    category: str
    score: int = Field(..., ge=0, le=100)
    feedback: list[str] = Field(default_factory=list)


class ATSScore(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    details: list[ATSScoreDetail]
    recommendations: list[str] = Field(default_factory=list)


class ImprovementSuggestion(BaseModel):
    category: str
    suggestion: str
    priority: str = Field(default="medium", description="high, medium or low")


class ResumeFeedback(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    suggestions: list[ImprovementSuggestion]
    language_suggestions: list[str] = Field(default_factory=list)
    overall_feedback: str


class AnalysisResponse(BaseModel):
    resume: ResumeParsed
    job_description: JobDescriptionParsed
    skill_comparison: SkillComparison
    ats_score: ATSScore
    feedback: ResumeFeedback
    generated_at: datetime


class KeywordGapResponse(BaseModel):
    missing_keywords: list[str]
