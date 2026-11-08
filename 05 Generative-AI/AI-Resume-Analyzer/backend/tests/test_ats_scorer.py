from app.schemas import ContactInfo, Education, Experience, JobDescriptionParsed, Project, ResumeParsed
from app.services.ats_scorer import ATSScorer


def _job() -> JobDescriptionParsed:
    return JobDescriptionParsed(
        title="Engineer", company="Acme", summary="x", required_skills=["Python", "Docker"]
    )


def _strong_resume() -> ResumeParsed:
    return ResumeParsed(
        contact_info=ContactInfo(name="Jane Roe", email="j@x.com", phone="555-1234",
                                 linkedin="https://linkedin.com/in/jane", github="https://github.com/jane"),
        summary="Engineer",
        experience=[
            Experience(company="A", position="Dev", duration="2020 - 2022",
                       description="Built APIs serving 10000 users\nReduced latency by 30%"),
            Experience(company="B", position="Dev", duration="2018 - 2020",
                       description="Developed services\nLed migration of 5 systems"),
            Experience(company="C", position="Intern", duration="2017 - 2018", description="Designed tests"),
        ],
        education=[Education(institution="State University", degree="Bachelor of Science", graduation_year="2017")],
        skills=["Python", "Docker", "FastAPI", "SQL", "Git"],
        projects=[
            Project(name="P1", description="Does things", link="https://github.com/jane/p1"),
            Project(name="P2", description="More things", link="https://github.com/jane/p2"),
            Project(name="P3", description="Other things", link="https://github.com/jane/p3"),
        ],
    )


def test_scores_stay_within_bounds():
    result = ATSScorer().score(_strong_resume(), _job(), "word " * 400, 100.0)
    assert 0 <= result.overall_score <= 100
    assert all(0 <= d.score <= 100 for d in result.details)


def test_empty_resume_scores_lower_than_strong_resume():
    strong = ATSScorer().score(_strong_resume(), _job(), "word " * 400, 100.0)
    empty = ATSScorer().score(ResumeParsed(), _job(), "short text", 0.0)
    assert empty.overall_score < strong.overall_score
    assert empty.recommendations  # the weakest areas always produce advice


def test_recommendations_are_capped_at_five():
    result = ATSScorer().score(ResumeParsed(), _job(), "", 0.0)
    assert len(result.recommendations) <= 5
