from enum import Enum
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict

class Language(str, Enum):
    english = "english"
    urdu = "urdu"
    roman_urdu = "roman_urdu"

class Urgency(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"
    unknown = "unknown"

class FollowUpQuestion(BaseModel):
    id: str
    question: str
    reason: str = ""
    priority: Literal["high", "medium", "low"] = "medium"

class LegalIssue(BaseModel):
    issue: str
    explanation: str = ""
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)

class Pathway(BaseModel):
    title: str
    description: str
    prerequisites: list[str] = Field(default_factory=list)
    caution: str = ""

class Warning(BaseModel):
    code: str
    message: str
    severity: Literal["info", "warning", "urgent"] = "warning"

class TriageRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    message: str = Field(min_length=1, max_length=12000)
    language: Language = Language.english
    known_facts: list[str] = Field(default_factory=list, max_length=50)
    documents: list[dict] = Field(default_factory=list, max_length=30)
    timeline: list[dict] = Field(default_factory=list, max_length=100)
    legal_sources: list[dict] = Field(default_factory=list, max_length=50)

class TriageResult(BaseModel):
    model_config = ConfigDict(extra="forbid")
    category: str
    subcategory: str = ""
    summary: str
    issues: list[LegalIssue] = Field(default_factory=list)
    urgency: Urgency
    facts: list[str] = Field(default_factory=list)
    missing_facts: list[str] = Field(default_factory=list)
    follow_up_questions: list[FollowUpQuestion] = Field(default_factory=list)
    possible_pathways: list[Pathway] = Field(default_factory=list)
    warnings: list[Warning] = Field(default_factory=list)
    source_ids_used: list[str] = Field(default_factory=list)
    disclaimer: str = (
        "This is an AI-generated intake/triage summary, not a legal opinion. "
        "Verify important facts, deadlines and legal sources with a qualified "
        "lawyer or the relevant authority."
    )
