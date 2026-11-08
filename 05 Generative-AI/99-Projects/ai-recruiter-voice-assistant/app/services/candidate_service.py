from sqlalchemy.orm import Session

from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate


class CandidateService:
    @staticmethod
    def create_candidate(db: Session, candidate_data: CandidateCreate) -> Candidate:
        candidate = Candidate(
            first_name = candidate_data.first_name,
            last_name = candidate_data.last_name,
            dob = candidate_data.dob,
            email = candidate_data.email,
            job_applied = candidate_data.job_applied,
        )
    
        db.add(candidate)
        db.commit()
        db.refresh(candidate)

        return candidate
    
    @staticmethod
    def get_candidate(db: Session, candidate_id: int) -> Candidate | None:
        return db.query(Candidate).filter(Candidate.id == candidate_id).first()