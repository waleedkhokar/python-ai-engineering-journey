from datetime import date
from pydantic import BaseModel


class DOBverificationRequest(BaseModel):
    candidate_id: int
    dob: date


class DOBVerificationResponse(BaseModel):
    verified: bool
    message: str