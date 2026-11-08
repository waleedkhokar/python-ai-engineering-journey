from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class InterviewSlot(Base):
    __tablename__ = "interview_slots"

    id: Mapped[int] = mapped_column(primary_key=True)
    start_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    recruiter_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    candidate_id: Mapped[int] = mapped_column(ForeignKey("candidates.id"), nullable=False)
    call_id: Mapped[int] = mapped_column(ForeignKey("calls.id"), nullable=False)
    slot_id: Mapped[int] = mapped_column(ForeignKey("interview_slots.id"), nullable=False, unique=True)
    status: Mapped[str] = mapped_column(String(50), default="Booked")
    booked_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)