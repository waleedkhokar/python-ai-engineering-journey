import re
from sqlalchemy.orm import Session

from app.models.screening import ScreeningAnswer
from app.eligibility.questions import SCREENING_QUESTION_ORDER


class ScreeningService:

    YES_VALUES = {
        "yes",
        "yeah",
        "yep",
        "true",
        "1",
        "sure",
        "affirmative",
    }

    NO_VALUES = {
        "no",
        "nope",
        "false",
        "0",
        "negative",
    }

    @staticmethod
    def normalize_answer(question_key: str, answer: str) -> str:
        value = answer.strip().lower()

        # Yes/No questions
        yes_no_questions = {
            "work_authorized",
            "start_within_30_days",
            "full_time",
            "job_abandonment",
            "salary_acceptance",
            "language_fluent",
            "location_suitable",
            "working_hours",
            "interview_consent",
        }

        if question_key in yes_no_questions:
            cleaned = value.strip(" .,!?:;")
            if cleaned in ScreeningService.YES_VALUES:
                return "yes"
            if cleaned in ScreeningService.NO_VALUES:
                return "no"
        
        # Experience
        if question_key == "experience_years":
            match = re.search(r"\d+(?:\.\d+)?", value)
            if match:
                return match.group()
        
        # Education
        if question_key == "education":
            if "phd" in value or "doctor" in value:
                return "phd"
            if "master" in value:
                return "master"
            if "bachelor" in value:
                return "bachelor"
        return value


    @staticmethod
    def get_next_question(db: Session, call_id: int) -> str | None:
        answers = ScreeningService.get_answers(db=db, call_id=call_id)

        for question_key in SCREENING_QUESTION_ORDER:
            if question_key not in answers:
                return question_key

        return None


    @staticmethod
    def save_answer(db: Session, candidate_id: int, call_id: int, question_key: str, answer: str,) -> ScreeningAnswer:
        normalized_answer = ScreeningService.normalize_answer(question_key=question_key, answer=answer,)

        existing_answer = (
            db.query(ScreeningAnswer).filter(
                ScreeningAnswer.call_id == call_id,
                ScreeningAnswer.question_key == question_key,
            ).first()
        )

        if existing_answer:
            existing_answer.answer = normalized_answer
            db.commit()
            db.refresh(existing_answer)

            return existing_answer

        screening_answer = ScreeningAnswer(
            candidate_id=candidate_id,
            call_id=call_id,
            question_key=question_key,
            answer=normalized_answer,
        )

        db.add(screening_answer)
        db.commit()
        db.refresh(screening_answer)

        return screening_answer

    @staticmethod
    def get_answers(db: Session, call_id: int) -> dict[str, str]:
        answers = (db.query(ScreeningAnswer).filter(ScreeningAnswer.call_id == call_id).all())

        return {
            answer.question_key: answer.answer
            for answer in answers
        }
    