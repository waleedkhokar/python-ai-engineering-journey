from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import ChatRequest, ChatResponse
from app.agents.analytics_agent import analytics_agent

router = APIRouter(prefix="/analytics", tags=["AI Analytics Agent (Admin)"])

@router.post("/query", response_model=ChatResponse)
def run_analytics_query(payload: ChatRequest):
    # In a full production build, you would verify if the logged-in user has the "admin" role here.
    
    reply_text = analytics_agent.run(payload.message)
    
    return ChatResponse(
        reply=reply_text,
        agent_type="analytics",
        escalated=False
    )