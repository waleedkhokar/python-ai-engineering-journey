from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ChatRequest, ChatResponse
from app.agents.support_agent import support_agent

router = APIRouter(prefix="/support", tags=["AI Support Agent"])

@router.post("/chat", response_model=ChatResponse)
def chat_with_support(payload: ChatRequest, db: Session = Depends(get_db)):
    # Run the support agent with live database context
    reply_text = support_agent.run(payload.message, db)
    
    return ChatResponse(
        reply=reply_text,
        agent_type="support",
        escalated=False
    )