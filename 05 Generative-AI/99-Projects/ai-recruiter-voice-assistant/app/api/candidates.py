from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.candidate import (CandidateCreate, CandidateResponse)
from app.services.candidate_service import CandidateService


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)

# Router to create a Candidate
@router.post("", response_model=CandidateResponse, status_code=201)
def create_candidate(candidate_data: CandidateCreate, db: Session = Depends(get_db)):
    candidate = CandidateService.create_candidate(db=db, candidate_data=candidate_data)
    return candidate

# Router to get a Candidate
@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = CandidateService.get_candidate(db=db, candidate_id=candidate_id)
    
    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )
    
    return candidate