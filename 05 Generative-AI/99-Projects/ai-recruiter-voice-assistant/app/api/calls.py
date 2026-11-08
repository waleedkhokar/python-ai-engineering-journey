from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas.call import StartVoiceSessionRequest, VoiceSessionResponse, LinkVapiCallRequest
from app.services.call_service import CallService
from app.services.candidate_service import CandidateService


router = APIRouter(
    prefix="/voice-sessions",
    tags=["Voice Sessions"]
)

@router.post("/start", response_model=VoiceSessionResponse, status_code=201)
async def start_voice_session(data: StartVoiceSessionRequest, db: Session = Depends(get_db)):
    candidate = CandidateService.get_candidate(db=db, candidate_id=data.candidate_id)

    if not candidate:
        raise HTTPException(
            status_code = 404,
            detail = "Candidate not found",
        )
    
    call = await CallService.start_voice_session(db=db, candidate=candidate)
    
    return VoiceSessionResponse(
        local_call_id=call.id,
        candidate_id=call.candidate_id,
        candidate_name=f"{candidate.first_name} {candidate.last_name}",
        vapi_call_id=call.vapi_call_id,
        call_type=call.call_type,
        status=call.status,
        started_at=call.started_at,
        ended_at=call.ended_at,
        squad_id=settings.vapi_squad_id,
        created_at=call.created_at,
    )


@router.patch("/{call_id}/vapi-call", response_model=VoiceSessionResponse)
def link_vapi_call(call_id: int, data: LinkVapiCallRequest, db: Session = Depends(get_db)):
    call = CallService.get_call(db=db, call_id=call_id)

    if not call:
        raise HTTPException(
            status_code = 404,
            detail = "Voice session not found"
        )
    
    updated_call = CallService.link_vapi_call(db=db, call=call, vapi_call_id=data.vapi_call_id)

    candidate = CandidateService.get_candidate(db=db, candidate_id=updated_call.candidate_id)

    return VoiceSessionResponse(
        local_call_id=updated_call.id,
        candidate_id=updated_call.candidate_id,
        candidate_name=(f"{candidate.first_name} {candidate.last_name}"),
        vapi_call_id=updated_call.vapi_call_id,
        squad_id=settings.vapi_squad_id,
        call_type=updated_call.call_type,
        status=updated_call.status,
        started_at=updated_call.started_at,
        ended_at=updated_call.ended_at,
        created_at=updated_call.created_at
    )