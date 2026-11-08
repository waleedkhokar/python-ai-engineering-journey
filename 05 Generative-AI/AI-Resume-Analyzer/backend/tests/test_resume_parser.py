import pytest

from app.services.resume_parser import ResumeParser


@pytest.fixture
def parser(spacy_ready) -> ResumeParser:
    return ResumeParser()


def test_extracts_contact_details(parser, sample_resume_text):
    parsed = parser.parse_text(sample_resume_text)
    assert parsed.contact_info.name == "John Doe"
    assert parsed.contact_info.email == "john.doe@example.com"
    assert parsed.contact_info.phone == "+1-234-567-8900"
    assert parsed.contact_info.linkedin == "https://linkedin.com/in/johndoe"
    assert parsed.contact_info.github == "https://github.com/johndoe"


def test_extracts_experience_entries(parser, sample_resume_text):
    parsed = parser.parse_text(sample_resume_text)
    assert len(parsed.experience) == 2
    assert parsed.experience[0].position == "Senior Python Developer"
    assert parsed.experience[0].company == "TechCorp Inc."
    assert parsed.experience[0].duration == "Jan 2021 - Present"
    assert "Docker" in parsed.experience[0].skills or "Docker" in parsed.skills


def test_extracts_education_certifications_and_projects(parser, sample_resume_text):
    parsed = parser.parse_text(sample_resume_text)
    assert parsed.education[0].institution == "University of Technology"
    assert parsed.education[0].degree.startswith("Bachelor of Science")
    assert {c.name for c in parsed.certifications} == {
        "AWS Certified Solutions Architect - Associate",
        "Docker Certified Associate",
    }
    assert parsed.certifications[1].issuer == ""  # the year must not be stored as an issuer
    assert parsed.projects[0].name == "Resume Analyzer"
    assert parsed.projects[0].link == "https://github.com/johndoe/resume-analyzer"


def test_skills_use_canonical_names(parser, sample_resume_text):
    skills = parser.parse_text(sample_resume_text).skills
    assert {"Python", "PostgreSQL", "FastAPI", "Docker"} <= set(skills)


def test_docx_upload_is_parsed(parser, make_docx, sample_resume_text):
    parsed, raw = parser.parse_file(make_docx(sample_resume_text), "docx")
    assert parsed.contact_info.email == "john.doe@example.com"
    assert "Senior Python Developer" in raw


def test_text_too_short_is_rejected(parser, make_docx):
    with pytest.raises(ValueError, match="Could not read enough text"):
        parser.parse_file(make_docx("Only a few words here"), "docx")


def test_pdf_upload_is_parsed(parser, make_pdf, sample_resume_text):
    lines = [line for line in sample_resume_text.splitlines() if line.strip()]
    parsed, _ = parser.parse_file(make_pdf(lines), "pdf")
    assert parsed.contact_info.email == "john.doe@example.com"
    assert [e.position for e in parsed.experience] == ["Senior Python Developer", "Python Developer"]
