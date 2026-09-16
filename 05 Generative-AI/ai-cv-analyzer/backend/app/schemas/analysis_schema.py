from typing import List, Optional
from pydantic import BaseModel, Field


class CVAnalysisResponse(BaseModel):
  filename: Optional[str] = Field(
      None, description="Filename of the uploaded CV (used in batch analysis)."
  )
  match_score: int = Field(
      ...,
      description="Match score percentage from 0 to 100 based on CV and JD.",
  )
  matching_skills: List[str] = Field(
      ..., description="List of skills found in both the CV and JD."
  )
  missing_skills: List[str] = Field(
      ..., description="Important skills required in the JD but missing from CV."
  )
  experience_gaps: List[str] = Field(
      ..., description="Gaps or mismatches in experience level or domain."
  )
  ats_issues: List[str] = Field(
      ...,
      description=(
          "Potential ATS (Applicant Tracking System) issues found in the CV."
      ),
  )
  suggested_improvements: List[str] = Field(
      ..., description="Actionable bullet points to improve the CV for this role."
  )
  interview_questions: List[str] = Field(
      ..., description="Targeted technical or behavioral interview questions."
  )