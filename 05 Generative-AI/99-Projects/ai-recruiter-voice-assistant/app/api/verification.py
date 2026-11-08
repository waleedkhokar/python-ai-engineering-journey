from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.verification import (DOBverificationRequest, DOBVerificationResponse)
from app.services.candidate_service import CandidateService
from app.services.verification_service import VerificationService


router = APIRouter(
    prefix="/tools",
    tags=["Vapi Tools"]
)


@router.post("/verify-dob", response_model=DOBVerificationResponse)
def verify_dob(data: DOBverificationRequest, db: Session = Depends(get_db)):
    candidate = CandidateService.get_candidate(db=db, candidate_id=data.candidate_id)

    if not candidate:
        raise HTTPException(
            status_code = 404,
            detail = "Candidate not found"
        )
    
    verified = VerificationService.verify_dob(
        db=db, 
        candidate_id=data.candidate_id,
        provided_dob=data.dob 
    )

    if verified:
        return DOBVerificationResponse(
            verified=True,
            message="Date of birth verified successfully."
        )
    
    return DOBVerificationResponse(
        verified=False,
        message="Date of birth does not match our records."
    )