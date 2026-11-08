from datetime import datetime
from enum import Enum
from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base

class CallStatus(str, Enum):
    INITIATED = "Initiated"
    HUNG_UP = "HungUp"
    NOT_ELIGIBLE = "NotEligible"
    ELIGIBLE = "Eligible"
    PRE_BOOKED = "PreBooked"
    BOOKED = "Booked"
    TRANSFERRED = "Transferred"
    RCB = "RCB"
    NOT_INTERESTED = "NotInterested"
    FAILED = "Failed"

class Call(Base):
    __tablename__ = "calls"

    id: Mapped[int] = mapped_column(primary_key=True)
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"), nullable=False)
    vapi_call_id: Mapped[str | None] = mapped_column(String(255), nullable=True, unique=True)
    call_type: Mapped[str] = mapped_column(String(50), default="webcall")
    status: Mapped[str] = mapped_column(String(50), default=CallStatus.INITIATED.value)
    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    