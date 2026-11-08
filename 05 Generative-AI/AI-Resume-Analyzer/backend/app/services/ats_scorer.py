"""ATS-style compatibility score.

This is a transparent heuristic checklist, not a replica of any real applicant
tracking system. Each category is scored with explicit rules so the user can see
why a score is what it is.
"""
from __future__ import annotations

from app.schemas import ATSScore, ATSScoreDetail, JobDescriptionParsed, ResumeParsed
from app.services.resume_parser import ResumeParser

CATEGORY_WEIGHTS: dict[str, float] = {
    "Contact Information": 0.10,
    "Experience": 0.30,
    "Skills Match": 0.25,
    "Education": 0.15,
    "Projects & Portfolio": 0.10,
    "Formatting": 0.10,
}


def _contact_score(resume: ResumeParsed) -> ATSScoreDetail:
    c = resume.contact_info
    checks = [
        (c.email, 30, "Add an email address."),
        (c.phone, 20, "Add a phone number."),
        (c.name, 10, "Put your full name at the top of the resume."),
        (c.linkedin, 20, "Add your LinkedIn profile URL."),
        (c.github, 20, "Add your GitHub profile URL for technical roles."),
    ]
    score = sum(points for value, points, _ in checks if value)
    feedback = [message for value, _, message in checks if not value] or ["All key contact details are present."]
    return ATSScoreDetail(category="Contact Information", score=min(score, 100), feedback=feedback)


def _experience_score(resume: ResumeParsed) -> ATSScoreDetail:
    exp = resume.experience
    feedback: list[str] = []
    score = 0
    if exp:
        score += 30
    else:
        feedback.append("Add a work experience section with dates and role titles.")
    if len(exp) >= 3:
        score += 40
    elif len(exp) == 2:
        score += 25
    elif len(exp) == 1:
        score += 15
    if exp and len(exp) < 2:
        feedback.append("Add more roles or projects to show progression.")

    detailed = sum(1 for e in exp if e.description and len(e.description) > 40)
    if exp and detailed == len(exp):
        score += 30
    elif detailed:
        score += 15
        feedback.append("Give every role a short description of what you did.")

    strong, total = ResumeParser.count_action_verb_bullets(exp)
    if total and strong / total >= 0.5:
        score += 10
    elif total:
        feedback.append("Start more bullet points with strong action verbs such as Built, Led, or Reduced.")

    has_numbers = any(
        any(ch.isdigit() for ch in (e.description or "")) for e in exp
    )
    if exp and not has_numbers:
        feedback.append("Add measurable results (percentages, counts, time saved).")
    return ATSScoreDetail(category="Experience", score=min(score, 100), feedback=feedback or ["Experience section is well developed."])


def _skills_score(resume: ResumeParsed, required: list[str], matched_percentage: float) -> ATSScoreDetail:
    skills = resume.skills
    feedback: list[str] = []
    score = 20 if skills else 0
    if len(skills) >= 15:
        score += 40
    elif len(skills) >= 10:
        score += 30
    elif len(skills) >= 5:
        score += 20
    else:
        feedback.append("List more technical skills in a dedicated skills section.")
    if required:
        if matched_percentage >= 80:
            score += 40
        elif matched_percentage >= 60:
            score += 25
        elif matched_percentage > 0:
            score += 15
        feedback.append(f"Matches {matched_percentage:.0f}% of the required skills in the job description.")
    else:
        score += 20
        feedback.append("No required skills were detected in the job description.")
    return ATSScoreDetail(category="Skills Match", score=min(score, 100), feedback=feedback)


def _education_score(resume: ResumeParsed) -> ATSScoreDetail:
    edu = resume.education
    feedback: list[str] = []
    if not edu:
        return ATSScoreDetail(category="Education", score=0, feedback=["Add your education, including degree and institution."])
    score = 40
    degrees = " ".join(e.degree.lower() for e in edu)
    if "master" in degrees or "phd" in degrees.replace(".", "") or "doctor" in degrees:
        score += 30
    elif "bachelor" in degrees or "b.sc" in degrees or "bsc" in degrees:
        score += 20
    if any(e.institution for e in edu):
        score += 15
    else:
        feedback.append("Include the name of the institution for each degree.")
    if any(e.graduation_year for e in edu):
        score += 15
    else:
        feedback.append("Add graduation years.")
    return ATSScoreDetail(category="Education", score=min(score, 100), feedback=feedback or ["Education section is complete."])


def _projects_score(resume: ResumeParsed) -> ATSScoreDetail:
    projects = resume.projects
    feedback: list[str] = []
    if not projects:
        return ATSScoreDetail(category="Projects & Portfolio", score=0, feedback=["Add projects that show your skills in practice."])
    score = 30
    score += 40 if len(projects) >= 3 else 20 if len(projects) == 2 else 10
    if len(projects) < 3:
        feedback.append("Add more projects. Three well-described projects is a good target.")
    if any(p.description for p in projects):
        score += 15
    else:
        feedback.append("Describe what each project does and the result.")
    if any(p.link for p in projects):
        score += 15
    else:
        feedback.append("Link to project repositories or live demos.")
    return ATSScoreDetail(category="Projects & Portfolio", score=min(score, 100), feedback=feedback or ["Portfolio section is strong."])


def _formatting_score(resume: ResumeParsed, resume_text: str) -> ATSScoreDetail:
    """Checks what can be seen in extracted text. Layout, columns, and tables cannot be verified this way."""
    feedback: list[str] = []
    score = 100
    words = len(resume_text.split())
    populated = sum(
        bool(section) for section in (
            resume.summary, resume.experience, resume.education, resume.skills, resume.projects, resume.certifications,
        )
    )
    if words < 150:
        score -= 30
        feedback.append("The resume text is very short. Add more detail.")
    elif words > 1000:
        score -= 10
        feedback.append("The resume is long. Aim for one to two pages.")
    if populated < 3:
        score -= 25
        feedback.append("Use clear section headings such as Experience, Education, and Skills.")
    if len(resume.skills) < 3 and populated >= 3:
        score -= 5
    feedback.append("Layout checks are limited to extracted text. Avoid tables, text boxes, and multi-column layouts.")
    return ATSScoreDetail(category="Formatting", score=max(score, 0), feedback=feedback)


class ATSScorer:
    def score(
        self,
        resume: ResumeParsed,
        job: JobDescriptionParsed,
        resume_text: str,
        skill_match_percentage: float,
    ) -> ATSScore:
        details = [
            _contact_score(resume),
            _experience_score(resume),
            _skills_score(resume, job.required_skills, skill_match_percentage),
            _education_score(resume),
            _projects_score(resume),
            _formatting_score(resume, resume_text),
        ]
        overall = round(sum(d.score * CATEGORY_WEIGHTS[d.category] for d in details))
        recommendations = self._recommendations(details)
        return ATSScore(overall_score=int(overall), details=details, recommendations=recommendations)

    @staticmethod
    def _recommendations(details: list[ATSScoreDetail]) -> list[str]:
        """Take the first actionable message from each of the three weakest categories that scored below 80."""
        weakest = sorted((d for d in details if d.score < 80), key=lambda d: d.score)[:3]
        return [d.feedback[0] for d in weakest if d.feedback][:5]
