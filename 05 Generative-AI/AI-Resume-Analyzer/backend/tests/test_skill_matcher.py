from app.services.skill_matcher import SkillMatcher


def test_exact_matches_and_missing_skills():
    matcher = SkillMatcher(use_embeddings=False)
    result = matcher.compare(
        resume_skills=["Python", "PostgreSQL"],
        required_skills=["Python", "Kubernetes"],
        nice_to_have_skills=["GraphQL"],
    )
    assert [m.skill for m in result.matching_skills] == ["Python"]
    assert result.matching_skills[0].method == "exact"
    assert result.missing_skills == ["Kubernetes"]
    assert result.additional_skills == ["PostgreSQL"]
    assert result.match_percentage == 50.0


def test_no_required_skills_gives_zero_percent_not_error():
    result = SkillMatcher(use_embeddings=False).compare(["Python"], [])
    assert result.match_percentage == 0.0
    assert result.missing_skills == []


def test_nice_to_have_does_not_affect_percentage():
    result = SkillMatcher(use_embeddings=False).compare(["Python"], ["Python"], ["Docker"])
    assert result.match_percentage == 100.0
