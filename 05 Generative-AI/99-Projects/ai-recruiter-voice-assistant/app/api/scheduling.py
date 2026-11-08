from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.scheduling import (
    AvailableSlotsRequest,
    AvailableSlotsResponse,
    InterviewSlotResponse,
    BookInterviewRequest,
    BookInterviewResponse,
)
from app.services.call_service import CallService
from app.services.candidate_service import CandidateService
from app.services.scheduling_service import SchedulingService


router = APIRouter(
    prefix="/tools",
    tags=["Vapi Tools"]
)


@router.post("/available-slots", response_model=AvailableSlotsResponse)
def get_available_slots(data: AvailableSlotsRequest, db: Session = Depends(get_db)):
    candidate = CandidateService.get_candidate(db=db, candidate_id=data.candidate_id)

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    call = CallService.get_call(db=db, call_id=data.call_id)

    if not call:
        raise HTTPException(status_code=404, detail="Voice session not found")
    
    slots = SchedulingService.get_available_slots(db=db)

    return AvailableSlotsResponse(
        slots = [
            InterviewSlotResponse(
                slot_id=slot.id,
                start_time=slot.start_time,
                end_time=slot.end_time,
                recruiter_name=slot.recruiter_name
            )
            for slot in slots
        ]
    )


@router.post("/book-interview", response_model=BookInterviewResponse)
def book_interview(data: BookInterviewRequest, db: Session = Depends(get_db)):
    candidate = CandidateService.get_candidate(db=db, candidate_id=data.candidate_id)

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    call = CallService.get_call(db=db, call_id=data.call_id)

    if not call:
        raise HTTPException(status_code=404, detail="Voice session not found")
    
    interview = SchedulingService.book_interview(
        db=db,
        candidate_id=data.candidate_id,
        call_id=data.call_id,
        slot_id=data.slot_id
    )

    if not interview:
        return BookInterviewResponse(
            booked=False,
            message=("The selected interview slot is no longer available.")
        )
    
    CallService.update_status(db=db, call=call, status="Booked")

    return BookInterviewResponse(
        booked = True,
        message = "Interview booked successfully.",
        interview_id = interview.id,
        slot_id = interview.slot_id
    )
