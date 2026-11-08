from app.services.job_parser import JobDescriptionParser, keyword_gaps


def test_parses_title_company_and_requirements(sample_job_text):
    job = JobDescriptionParser().parse(sample_job_text)
    assert job.title == "Senior Python Developer"
    assert job.company == "TechCorp Inc."
    assert {"AWS", "Docker", "Kubernetes", "FastAPI"} <= set(job.required_skills)


def test_nice_to_have_skills_are_separate(sample_job_text):
    job = JobDescriptionParser().parse(sample_job_text)
    assert "GraphQL" in job.nice_to_have_skills
    assert "GraphQL" not in job.required_skills


def test_extracts_years_and_salary(sample_job_text):
    job = JobDescriptionParser().parse(sample_job_text)
    assert job.years_experience == 5
    assert job.salary_range == "$120,000 - $160,000"
    assert job.location == "Remote (US)"


def test_text_without_headers_treats_skills_as_required():
    text = "Backend Engineer at Acme\nWe use Python, Docker and PostgreSQL every day to ship features."
    job = JobDescriptionParser().parse(text)
    assert {"Python", "Docker", "PostgreSQL"} <= set(job.required_skills)


def test_keyword_gaps_lists_missing_skills_required_first(sample_job_text):
    gaps = keyword_gaps(sample_job_text, ["Python"])
    assert gaps.index("Kubernetes") < gaps.index("GraphQL")
    assert "Python" not in gaps
