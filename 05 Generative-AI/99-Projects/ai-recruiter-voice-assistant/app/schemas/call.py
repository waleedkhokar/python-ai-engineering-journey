from datetime import datetime
from pydantic import BaseModel


class StartVoiceSessionRequest(BaseModel):
    candidate_id: int


class LinkVapiCallRequest(BaseModel):
    vapi_call_id: str


class VoiceSessionResponse(BaseModel):
    local_call_id: int
    candidate_id: int
    candidate_name: str
    vapi_call_id: str | None = None
    squad_id: str

    call_type: str
    status: str

    started_at: datetime | None = None
    ended_at: datetime | None = None
    created_at: datetime