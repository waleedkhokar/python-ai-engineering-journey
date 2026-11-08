from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_parse_job_returns_structured_data(sample_job_text):
    response = client.post("/api/v1/parse-job", data={"job_description": sample_job_text})
    assert response.status_code == 200
    body = response.json()
    assert body["title"] == "Senior Python Developer"
    assert "Kubernetes" in body["required_skills"]


def test_parse_job_rejects_very_short_text():
    response = client.post("/api/v1/parse-job", data={"job_description": "too short"})
    assert response.status_code == 422


def test_analyze_docx_returns_full_report(spacy_ready, make_docx, sample_resume_text, sample_job_text):
    response = client.post(
        "/api/v1/analyze",
        data={"job_description": sample_job_text},
        files={"resume_file": ("resume.docx", make_docx(sample_resume_text), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
    )
    assert response.status_code == 200, response.text
    body = response.json()
    assert 0 <= body["ats_score"]["overall_score"] <= 100
    assert "Kubernetes" in body["skill_comparison"]["missing_skills"]
    assert body["feedback"]["overall_feedback"]
    assert len(body["ats_score"]["details"]) == 6


def test_analyze_rejects_unsupported_extension(sample_job_text):
    response = client.post(
        "/api/v1/analyze",
        data={"job_description": sample_job_text},
        files={"resume_file": ("resume.txt", b"plain text resume", "text/plain")},
    )
    assert response.status_code == 400


def test_analyze_rejects_file_whose_content_does_not_match_extension(sample_job_text):
    response = client.post(
        "/api/v1/analyze",
        data={"job_description": sample_job_text},
        files={"resume_file": ("resume.pdf", b"this is not a pdf file at all", "application/pdf")},
    )
    assert response.status_code == 400
    assert "does not match" in response.json()["detail"]


def test_analyze_requires_a_resume_file(sample_job_text):
    response = client.post("/api/v1/analyze", data={"job_description": sample_job_text})
    assert response.status_code == 400


def test_keywords_endpoint_lists_gaps(sample_job_text):
    response = client.post(
        "/api/v1/keywords",
        data={"job_description": sample_job_text, "resume_skills": ["Python"]},
    )
    assert response.status_code == 200
    assert "Kubernetes" in response.json()["missing_keywords"]


def test_match_skills_endpoint():
    response = client.post(
        "/api/v1/match-skills",
        data={"resume_skills": ["Python"], "required_skills": ["Python", "Kubernetes"]},
    )
    assert response.status_code == 200
    assert response.json()["match_percentage"] == 50.0


def test_analyze_pdf_returns_report(spacy_ready, make_pdf, sample_resume_text, sample_job_text):
    lines = [line for line in sample_resume_text.splitlines() if line.strip()]
    response = client.post(
        "/api/v1/analyze",
        data={"job_description": sample_job_text},
        files={"resume_file": ("resume.pdf", make_pdf(lines), "application/pdf")},
    )
    assert response.status_code == 200, response.text
    assert response.json()["resume"]["contact_info"]["name"] == "John Doe"
