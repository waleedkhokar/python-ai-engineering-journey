from datetime import datetime
from sqlalchemy.orm import Session

from app.models.call import Call
from app.models.call_result import CallResult


class CallResultService:
    @staticmethod
    def save_result(db: Session, call: Call, transcript: str | None, recording_url: str | None, ended_reason: str | None, started_at: datetime | None, ended_at: datetime | None,) -> CallResult:
        existing_result = (db.query(CallResult).filter(CallResult.call_id == call.id).first())
    
        if existing_result:
            existing_result.final_status = call.status
            existing_result.transcript = transcript
            existing_result.recording_url = recording_url
            existing_result.ended_reason = ended_reason
            existing_result.started_at = started_at
            existing_result.ended_at = ended_at
            
            db.commit()
            db.refresh(existing_result)
            
            return existing_result

        result = CallResult(
            call_id = call.id,
            candidate_id = call.candidate_id,
            final_status = call.status,
            transcript = transcript,
            recording_url = recording_url,
            ended_reason = ended_reason,
            started_at = started_at,
            ended_at = ended_at
        )

        db.add(result)
        db.commit()
        db.refresh(result)

        return result