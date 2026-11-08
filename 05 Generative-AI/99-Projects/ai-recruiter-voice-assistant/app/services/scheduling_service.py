from datetime import datetime
from sqlalchemy.orm import Session

from app.models.interview import InterviewSlot, Interview


class SchedulingService:
    @staticmethod
    def get_available_slots(db: Session,) -> list[InterviewSlot]:
        return (
            db.query(InterviewSlot).filter(
            InterviewSlot.is_available.is_(True),
            InterviewSlot.start_time > datetime.utcnow()
        ).order_by(InterviewSlot.start_time).limit(5).all()
        )
    
    @staticmethod
    def book_interview(db: Session, candidate_id: int, call_id: int, slot_id: int) -> Interview | None:
        slot = (
            db.query(InterviewSlot).filter(
                InterviewSlot.id == slot_id,
                InterviewSlot.is_available.is_(True)
            ).first()
        )

        if not slot:
            return None
        
        slot.is_available = False
        
        interview = Interview(
            candidate_id=candidate_id,
            call_id=call_id,
            slot_id=slot.id,
            status="Booked"
        ) 

        db.add(interview)
        db.commit()
        db.refresh(interview)

        return interview

