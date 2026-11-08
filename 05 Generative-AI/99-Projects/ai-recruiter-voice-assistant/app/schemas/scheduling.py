from datetime import datetime
from pydantic import BaseModel


class AvailableSlotsRequest(BaseModel):
    candidate_id: int
    call_id: int


class InterviewSlotResponse(BaseModel):
    slot_id: int
    start_time: datetime
    end_time: datetime
    recruiter_name: str | None = None


class AvailableSlotsResponse(BaseModel):
    slots: list[InterviewSlotResponse]


class BookInterviewRequest(BaseModel):
    candidate_id: int
    call_id: int
    slot_id: int 


class BookInterviewResponse(BaseModel):
    booked: bool
    message: str
    interview_id: int
    slot_id: int | None = None