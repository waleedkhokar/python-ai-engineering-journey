"""Rule-based resume feedback.

The feedback is generated from explicit rules, so it is predictable and free to run.
It does not call a language model.
"""
from __future__ import annotations

import re

from app.schemas import (
    ImprovementSuggestion,
    JobDescriptionParsed,
    ResumeFeedback,
    ResumeParsed,
    SkillComparison,
)

WEAK_PHRASES: dict[str, list[str]] = {
    "worked on": ["Developed", "Built", "Implemented"],
    "helped": ["Contributed to", "Supported", "Enabled"],
    "was responsible for": ["Owned", "Led", "Managed"],
    "responsible for": ["Owned", "Led", "Managed"],
    "did": ["Delivered", "Completed", "Executed"],
    "made": ["Created", "Produced", "Built"],
}
METRIC_RE = re.compile(r"\d+%|\$\s?\d|\b\d+\s*(?:users|customers|requests|x|ms|hours|days)\b", re.IGNORECASE)


class FeedbackGenerator:
    def generate(
        self,
        resume: ResumeParsed,
        job: JobDescriptionParsed,
        comparison: SkillComparison,
        ats_score: int,
        resume_text: str,
    ) -> ResumeFeedback:
        strengths = self._strengths(resume, comparison, ats_score)
        weaknesses = self._weaknesses(resume, comparison, ats_score, resume_text)
        suggestions = self._suggestions(resume, job, comparison, resume_text)
        language = self._language_suggestions(resume_text)
        return ResumeFeedback(
            strengths=strengths,
            weaknesses=weaknesses,
            suggestions=suggestions,
            language_suggestions=language,
            overall_feedback=self._overall(strengths, weaknesses, ats_score, comparison, job),
        )

    @staticmethod
    def _strengths(resume: ResumeParsed, comparison: SkillComparison, ats_score: int) -> list[str]:
        items: list[str] = []
        if comparison.match_percentage >= 70:
            items.append(f"Strong skill alignment with the role ({comparison.match_percentage:.0f}% of required skills).")
        elif comparison.match_percentage >= 40:
            items.append(f"Partial skill alignment ({comparison.match_percentage:.0f}% of required skills).")
        if resume.experience:
            items.append(f"Clear work history with {len(resume.experience)} listed role(s).")
        if resume.projects and any(p.link for p in resume.projects):
            items.append("Projects include links that recruiters can verify.")
        if resume.certifications:
            items.append("Certifications add credibility for the role.")
        if ats_score >= 75:
            items.append("Good overall ATS compatibility.")
        return items or ["The resume has a base to build on."]

    @staticmethod
    def _weaknesses(resume: ResumeParsed, comparison: SkillComparison, ats_score: int, resume_text: str) -> list[str]:
        items: list[str] = []
        if comparison.missing_skills:
            items.append("Missing required skills: " + ", ".join(comparison.missing_skills[:5]) + ".")
        if not resume.experience:
            items.append("No work experience section was detected.")
        if resume.experience and not any(METRIC_RE.search(e.description or "") for e in resume.experience):
            items.append("Experience bullets have no measurable results.")
        if not resume.projects:
            items.append("No projects section was detected.")
        if not resume.contact_info.github and not resume.contact_info.linkedin:
            items.append("No GitHub or LinkedIn profile link was found.")
        if ats_score < 60:
            items.append("ATS score is low. Review formatting and missing sections.")
        if any(re.search(rf"\b{re.escape(w)}\b", resume_text, re.IGNORECASE) for w in WEAK_PHRASES):
            items.append("Some phrases are passive or vague. Use stronger action verbs.")
        return items or ["No major weaknesses found by these checks."]

    @staticmethod
    def _suggestions(
        resume: ResumeParsed,
        job: JobDescriptionParsed,
        comparison: SkillComparison,
        resume_text: str,
    ) -> list[ImprovementSuggestion]:
        items: list[ImprovementSuggestion] = []
        for skill in comparison.missing_skills[:3]:
            items.append(ImprovementSuggestion(
                category="Skills",
                suggestion=f"Add {skill} if you have used it, or build a small project that demonstrates it.",
                priority="high",
            ))
        if resume.experience and not any(METRIC_RE.search(e.description or "") for e in resume.experience):
            items.append(ImprovementSuggestion(
                category="Achievements",
                suggestion="Add numbers to your bullets, for example 'reduced response time by 30%'.",
                priority="high",
            ))
        if not resume.projects:
            items.append(ImprovementSuggestion(
                category="Portfolio",
                suggestion="Add two or three projects with a one-line description and a link.",
                priority="medium",
            ))
        if not resume.certifications and job.required_skills:
            items.append(ImprovementSuggestion(
                category="Credentials",
                suggestion="Add relevant certifications if you hold any.",
                priority="low",
            ))
        if not resume.summary:
            items.append(ImprovementSuggestion(
                category="Summary",
                suggestion="Add a two-line summary that names your role and strongest skills.",
                priority="low",
            ))
        return sorted(items, key=lambda i: {"high": 0, "medium": 1, "low": 2}[i.priority])[:8]

    @staticmethod
    def _language_suggestions(resume_text: str) -> list[str]:
        suggestions: list[str] = []
        for weak, strong in WEAK_PHRASES.items():
            if re.search(rf"\b{re.escape(weak)}\b", resume_text, re.IGNORECASE):
                suggestions.append(f"Replace '{weak}' with a stronger verb such as '{strong[0]}' or '{strong[1]}'.")
        return suggestions[:6]

    @staticmethod
    def _overall(
        strengths: list[str],
        weaknesses: list[str],
        ats_score: int,
        comparison: SkillComparison,
        job: JobDescriptionParsed,
    ) -> str:
        tone = (
            "a strong base" if ats_score >= 75
            else "a solid base with room to improve" if ats_score >= 55
            else "gaps that should be addressed first"
        )
        lines = [f"This resume shows {tone} for the {job.title} role (ATS score {ats_score}/100)."]
        if comparison.missing_skills:
            lines.append(f"Focus first on the missing required skills: {', '.join(comparison.missing_skills[:3])}.")
        if weaknesses and not weaknesses[0].startswith("No major"):
            lines.append("Address the weaknesses listed above, starting with the highest-priority suggestions.")
        return " ".join(lines)
