from pydantic import BaseModel


class SaveScreeningAnswerRequest(BaseModel):
    candidate_id: int
    call_id: int
    question_key: str
    answer: str


class SaveScreeningAnswerResponse(BaseModel):
    saved: bool
    message: str
    screening_complete: bool
    next_question_key: str | None = None


class EligibilityRequest(BaseModel):
    candidate_id: int
    call_id: int


class FailedRule(BaseModel):
    rule: str
    reason: str


class EligibilityResponse(BaseModel):
    eligible: bool
    failed_rules: list[FailedRule]
