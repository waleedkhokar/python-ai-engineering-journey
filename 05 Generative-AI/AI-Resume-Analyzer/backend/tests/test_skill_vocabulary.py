from app.services.skill_vocabulary import canonical_name, extract_skills


def test_aliases_map_to_canonical_names():
    found = extract_skills("Experience with Postgres, K8s and node.js")
    assert {"PostgreSQL", "Kubernetes", "Node.js"} <= set(found)


def test_sql_is_not_matched_inside_postgresql():
    assert extract_skills("PostgreSQL") == ["PostgreSQL"]


def test_common_words_do_not_create_false_positives():
    assert extract_skills("I will go to the store and rest after work") == []


def test_github_profile_does_not_count_as_git_skill():
    assert "Git" not in extract_skills("See my github.com/example profile")


def test_canonical_name_resolves_aliases():
    assert canonical_name("postgres") == "PostgreSQL"
    assert canonical_name("PYTHON") == "Python"
    assert canonical_name("underwater basket weaving") is None
