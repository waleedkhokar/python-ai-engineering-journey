from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.call import Call, CallStatus
from app.models.candidate import Candidate


class CallService:
    @staticmethod
    async def start_voice_session(db: Session, candidate: Candidate) -> Call:
        call = Call(
            candidate_id = candidate.id,
            call_type = "webCall",
            status = CallStatus.INITIATED.value,
            started_at = datetime.now(timezone.utc),
        )

        db.add(call)
        db.commit()
        db.refresh(call)

        return call

    @staticmethod
    def get_call(db: Session, call_id: int) -> Call | None:
        return (db.query(Call).filter(Call.id == call_id).first())
    
    @staticmethod
    def link_vapi_call(db: Session, call: Call, vapi_call_id: str) -> Call:
        call.vapi_call_id = vapi_call_id
        db.commit()
        db.refresh(call)

        return call

    @staticmethod
    def update_status(db: Session, call: Call, status: str) -> Call:
        call.status = status
        
        db.commit()
        db.refresh(call)

        return call
    

    @staticmethod
    def get_call_by_vapi_id(db: Session, vapi_call_id: str) -> Call | None:
        return (
            db.query(Call).filter(
                Call.vapi_call_id == vapi_call_id
            ).first()
        )