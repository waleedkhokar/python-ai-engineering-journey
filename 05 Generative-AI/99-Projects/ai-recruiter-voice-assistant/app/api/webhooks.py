from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.webhook import VapiWebhookRequest
from app.services.call_service import CallService
from app.services.call_result_service import CallResultService


router = APIRouter(
    prefix="/vapi",
    tags=["Vapi Webhooks"]
)

@router.post("/webhook")
def vapi_webhook(payload: VapiWebhookRequest, db: Session = Depends(get_db)):
    message = payload.message
    message_type = message.get("type")

    if message_type == "status_update":
        return handle_status_update(message=message, db=db)

    if message_type == "end-of-call-report":
        return handle_end_of_call_report(message=message, db=db)

    return {
        "recieved": True,
        "type": message_type
    } 


def handle_status_update(message: dict, db: Session):
    call_data = message.get("call", {})
    vapi_call_id = call_data.get("id")

    if not vapi_call_id:
        return {"received": True}
    
    call = CallService.get_call_by_vapi_id(db=db, vapi_call_id=vapi_call_id)

    if not call:
        return {"received": True}
    
    if status == "ended":
        call.ended_at = datetime.utcnow()
        db.commit()
    
    return {
        "received": True,
        "status": status,
    }

def handle_end_of_call_report(message: dict, db: Session):
    call_data = message.get("call", {})
    artifact = message.get("artifact", {})

    vapi_call_id = call_data.get("id")

    if not vapi_call_id:
        return {"received": True}
    
    call = CallService.get_call_by_vapi_id(db=db, vapi_call_id=vapi_call_id)

    if not call:
        return {"received": True}

    transcript = artifact.get("transcript")
    recording = artifact.get("recording") or {}

    recording_url = (
        recording.get("mono", {}).get("combinedUrl")
        or recording.get("url")
        or message.get("recordingUrl")
    )

    ended_reason = message.get("endedReason")

    started_at = parse_datetime(
        message.get("startedAt") or call_data.get("startedAt")
    )

    ended_at = parse_datetime(
        message.get("endedAt") or call_data.get("endedAt")
    )

    if ended_at:
        call.ended_at = ended_at
    
    db.commit()

    CallResultService.save_result(
        db=db,
        call=call,
        transcript=transcript,
        recording_url=recording_url,
        ended_reason=ended_reason,
        started_at=started_at,
        ended_at=ended_at
    )

    return {
        "received": True,
        "saved": True
    }


def parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    
    return datetime.fromisoformat(
        value.replace("Z", "+00:00")
    )