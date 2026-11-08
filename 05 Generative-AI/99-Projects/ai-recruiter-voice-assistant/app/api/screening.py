from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.screening import (
    SaveScreeningAnswerResponse,
    SaveScreeningAnswerRequest,
    EligibilityRequest,
    EligibilityResponse
)
from app.services.candidate_service import CandidateService
from app.services.call_service import CallService
from app.services.screening_service import ScreeningService
from app.eligibility.engine import EligibilityEngine


router = APIRouter(
    prefix="/tools",
    tags=["Vapi Tools"]
)


@router.post("/save-screening-answer", response_model=SaveScreeningAnswerResponse)
def save_screening_answer(data: SaveScreeningAnswerRequest, db: Session = Depends(get_db)):
    candidate = CandidateService.get_candidate(db=db, candidate_id=data.candidate_id)

    if not candidate:
        raise HTTPException(status_code = 404, detail = "Candidate not found")
    
    call = CallService.get_call(db=db, call_id=data.call_id)

    if not call:
        raise HTTPException(status_code = 404, detail = "Voice session not found")
    
    expected_question = ScreeningService.get_next_question(db=db, call_id=data.call_id,)

    if expected_question is None:
        raise HTTPException(status_code=409, detail="Screening is already complete.",)

    if data.question_key != expected_question:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Answer received out of sequence.",
                "expected_question": expected_question,
                "received_question": data.question_key,
            },
        )
    
    ScreeningService.save_answer(
        db=db,
        candidate_id=data.candidate_id,
        call_id=data.call_id,
        question_key=data.question_key,
        answer=data.answer
    )

    next_question = ScreeningService.get_next_question(db=db, call_id=data.call_id)

    return SaveScreeningAnswerResponse(
        saved=True, 
        message="Screening answer saved successfully.",
        screening_complete=next_question is None,
        next_question_key=next_question,
    )


@router.post("/check-eligibility", response_model=EligibilityResponse)
def check_eligibility(data: EligibilityRequest, db: Session = Depends(get_db)):

    print("Eligibility candidate_id:", data.candidate_id)
    print("Eligibility call_id:", data.call_id)

    candidate = CandidateService.get_candidate(db=db, candidate_id=data.candidate_id)

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    call = CallService.get_call(db=db, call_id=data.call_id)

    if not call:
        raise HTTPException(status_code=404, detail="Voice session not found")
    
    answers = ScreeningService.get_answers(db=db, call_id=data.call_id)

    missing_questions = (EligibilityEngine.REQUIRED_QUESTIONS - set(answers.keys()))

    if missing_questions:
        raise HTTPException(
            status_code=409,
            detail={
                "message": "Screening is not complete yet.",
                "missing_questions": sorted(missing_questions),
            },
        )

    print("\n========== ELIGIBILITY DEBUG ==========")
    print("candidate_id:", data.candidate_id)
    print("call_id:", data.call_id)
    print("answers:", answers)
    print("=======================================\n")

    result = EligibilityEngine.evaluate(candidate=candidate, answers=answers)

    if result["eligible"]:
        CallService.update_status(db=db, call=call, status="Eligible")
    
    else:
        CallService.update_status(db=db, call=call, status="NotEligible")

    return EligibilityResponse(
        eligible=result["eligible"],
        failed_rules=result["failed_rules"]
    )