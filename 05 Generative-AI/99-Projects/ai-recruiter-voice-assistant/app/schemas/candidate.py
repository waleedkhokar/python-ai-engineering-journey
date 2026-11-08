from datetime import date, datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class CandidateCreate(BaseModel):
    first_name: str
    last_name: str
    dob: date
    email: EmailStr | None = None
    job_applied: str

class CandidateResponse(BaseModel):     # What FastAPI will return after reading the object
    id: int
    first_name: str
    last_name: str
    dob: date
    email: str | None
    job_applied: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)  # Allows FastAPI to read data directly from SQLAlchemy model attributes