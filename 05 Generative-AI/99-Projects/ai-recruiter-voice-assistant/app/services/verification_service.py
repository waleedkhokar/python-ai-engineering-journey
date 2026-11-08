from datetime import date
from sqlalchemy.orm import Session

from app.models.candidate import Candidate


class VerificationService:

    @staticmethod
    def verify_dob(db: Session, candidate_id: int, provided_dob: date) -> bool:
        candidate = (db.query(Candidate).filter(Candidate.id == candidate_id).first())

        if not candidate:
            return False

        return candidate.dob == provided_dob 