from datetime import date

from app.models.candidate import Candidate


class EligibilityEngine:

    REQUIRED_QUESTIONS = {
        "experience_years",
        "work_authorized",
        "start_within_30_days",
        "full_time",
        "job_abandonment",
        "education",
        "salary_acceptance",
        "language_fluent",
        "location_suitable",
        "working_hours",
        "interview_consent",
    }

    @staticmethod
    def _to_bool(value: str) -> bool:
        return value.strip().lower() in {
            "yes",
            "true",
            "1"
        }

    @staticmethod
    def evaluate(candidate: Candidate, answers: dict[str, str]) -> dict:
        failed_rules = []
        
        today = date.today()

        age = today.year - candidate.dob.year - ((today.month, today.day) < (candidate.dob.month, candidate.dob.day))

        if not 21 <= age <= 55:
            failed_rules.append({
                "rule": "age",
                "reason": "Candidate must be between 21 and 55 years old."
            })

        try:
            experience = float(answers.get("experience_years", "0"))
        except ValueError:
            experience = 0
        
        if experience < 2:
            failed_rules.append({
                "rule": "minimum_experience",
                "reason": ("Candidate requires at least 2 years of relevant experience.")
            })
        
        if not EligibilityEngine._to_bool(answers.get("work_authorized", "")):
            failed_rules.append({
                "rule": "work_authorization",
                "reason": "Candidate is not authorized to work."
            })
        
        if not EligibilityEngine._to_bool(answers.get("start_within_30_days", "")):
            failed_rules.append({
                "rule": "start_availability",
                "reason": ("Candidate cannot start within 30 days.")
            })
        
        if not EligibilityEngine._to_bool(answers.get("full_time", "")):
            failed_rules.append({
                "rule": "full_time",
                "reason": "Candidate is not available full-time."
            })
        
        if EligibilityEngine._to_bool(answers.get("job_abandonment", "")):
            failed_rules.append({
                "rule": "job_abandonment",
                "reason": ("Candidate reported job abandonment within the last 12 months.")
            })
        
        allowed_education = {
            "bachelor",
            "bachelors",
            "bachelor's",
            "master",
            "masters",
            "master's",
            "phd",
        }

        education = answers.get("education", "").strip().lower()

        if education not in allowed_education:
            failed_rules.append({
                "rule": "education",
                "reason": ("Candidate does not meet the minimum educational qualification.")
            })
        
        for key, rule_name, reason in [
            (
                "salary_acceptance",
                "salary",
                "Candidate does not accept the offered salary range."
            ),
            (
                "language_fluent",
                "language",
                "Candidate does not meet the language requirement."
            ),
            (
                "location_suitable",
                "location",
                "Candidate cannot meet the location requirement."
            ),
            (
                "working_hours",
                "working_hours",
                "Candidate does not accept the required working hours."
            ),
            (
                "interview_consent",
                "interview_consent",
                "Candidate does not wish to proceed with an interview.",
            )
        ]:
            if not EligibilityEngine._to_bool(answers.get(key, "")):
                failed_rules.append({
                    "rule": rule_name,
                    "reason": reason
                })

        return {
            "eligible": len(failed_rules) == 0,
            "failed_rules": failed_rules
        }
    