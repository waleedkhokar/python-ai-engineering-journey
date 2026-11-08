"""Job description parser.

Extracts the title, company, required and nice-to-have skills, years of
experience, location, and salary range from free-form job description text.
"""
from __future__ import annotations

import re

from app.schemas import JobDescriptionParsed
from app.services.skill_vocabulary import extract_skills

REQUIREMENT_HEADERS = (
    "requirements", "required skills", "required qualifications", "qualifications",
    "what you need", "what you bring", "must have", "must-have", "minimum qualifications",
)
NICE_HEADERS = (
    "nice to have", "nice-to-have", "preferred", "preferred qualifications", "bonus", "bonus points",
    "ideally",
)
RESPONSIBILITY_HEADERS = ("responsibilities", "what you will do", "what you'll do", "duties", "your role")

YEARS_PATTERNS = (
    re.compile(r"(\d{1,2})\+?\s*(?:years?|yrs?)[^.\n]{0,40}?experience", re.IGNORECASE),
    re.compile(r"(?:at least|minimum(?: of)?)\s+(\d{1,2})\s+(?:years?|yrs?)", re.IGNORECASE),
)
SALARY_RE = re.compile(
    r"\$\s?\d{2,3}(?:,\d{3}|k|K)?\s*(?:-|–|to)\s*\$?\s?\d{2,3}(?:,\d{3}|k|K)?", re.IGNORECASE
)
LOCATION_RE = re.compile(r"^(?:location|based in|office)\s*[:\-]\s*(.+)$", re.IGNORECASE)
COMPANY_RE = re.compile(r"^(?:company|employer)\s*[:\-]\s*(.+)$", re.IGNORECASE)


def _header_kind(line: str) -> str | None:
    """Return the section a header line opens, or None if the line is not a header."""
    key = line.lower().strip(" :-–—*#")
    if len(line) > 60:
        return None
    if key in REQUIREMENT_HEADERS:
        return "required"
    if key in NICE_HEADERS:
        return "nice"
    if key in RESPONSIBILITY_HEADERS:
        return "responsibilities"
    return None


class JobDescriptionParser:
    """Parses raw job description text into a JobDescriptionParsed object."""

    @staticmethod
    def clean_text(text: str) -> str:
        text = text.replace("\u200b", "").replace("\u2019", "'").replace("\r\n", "\n")
        return "\n".join(line.strip() for line in text.split("\n")).strip()

    @staticmethod
    def split_sections(text: str) -> dict[str, str]:
        """Split text into 'required', 'responsibilities', 'nice', and 'other' blocks."""
        sections: dict[str, list[str]] = {"required": [], "responsibilities": [], "nice": [], "other": []}
        current = "other"
        for line in text.split("\n"):
            kind = _header_kind(line)
            if kind:
                current = kind
                continue
            sections[current].append(line)
        return {key: "\n".join(value) for key, value in sections.items()}

    @staticmethod
    def _title_and_company(first_lines: list[str]) -> tuple[str, str]:
        title = ""
        company = ""
        for line in first_lines:
            company_match = COMPANY_RE.match(line)
            if company_match:
                company = company_match.group(1).strip()
                continue
            if not title and line:
                title_line = line.split(" at ")[0] if " at " in line else line
                parts = [p.strip() for p in re.split(r"\s[-–—|]\s", title_line, maxsplit=1)]
                title = parts[0][:120]
                if len(parts) > 1 and not company:
                    company = parts[1][:80]
        return title or "Untitled role", company or "Not specified"

    def parse(self, raw_text: str) -> JobDescriptionParsed:
        text = self.clean_text(raw_text)
        lines = [line for line in text.split("\n") if line]
        title, company = self._title_and_company(lines[:5])

        sections = self.split_sections(text)
        nice_text = sections["nice"]
        # If no requirement header exists, treat everything outside the nice-to-have block as required.
        has_requirement_header = any(_header_kind(line) == "required" for line in lines)
        required_text = (
            sections["required"] + "\n" + sections["responsibilities"]
            if has_requirement_header
            else sections["other"] + "\n" + sections["required"] + "\n" + sections["responsibilities"]
        )
        required = extract_skills(required_text)
        nice = [skill for skill in extract_skills(nice_text) if skill not in required]

        location_match = next((m for line in lines if (m := LOCATION_RE.match(line))), None)
        salary_match = SALARY_RE.search(text)
        years = next((int(m.group(1)) for pattern in YEARS_PATTERNS if (m := pattern.search(text))), None)

        return JobDescriptionParsed(
            title=title,
            company=company,
            summary=" ".join(lines[:4])[:400],
            required_skills=required,
            nice_to_have_skills=nice,
            years_experience=years,
            location=location_match.group(1).strip() if location_match else None,
            salary_range=salary_match.group(0) if salary_match else None,
        )


def keyword_gaps(job_text: str, resume_skills: list[str]) -> list[str]:
    """Return skills named in the job description that the resume does not list, required first."""
    parsed = JobDescriptionParser().parse(job_text)
    have = {skill.lower() for skill in resume_skills}
    ordered = parsed.required_skills + parsed.nice_to_have_skills
    return [skill for skill in ordered if skill.lower() not in have]
