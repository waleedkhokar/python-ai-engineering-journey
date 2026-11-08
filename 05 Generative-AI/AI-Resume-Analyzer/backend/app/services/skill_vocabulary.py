"""Canonical skill vocabulary shared by the resume and job description parsers.

Only unambiguous terms are included. Single common words such as "go", "rest",
or "spring" are deliberately left out because they cause false positives.
"""
import re
from functools import lru_cache

# Canonical name -> lowercase aliases that refer to it.
SKILL_ALIASES: dict[str, tuple[str, ...]] = {
    # Languages
    "Python": ("python",),
    "JavaScript": ("javascript",),
    "TypeScript": ("typescript",),
    "Java": ("java",),
    "C++": ("c++",),
    "C#": ("c#",),
    "Go": ("golang",),
    "Rust": ("rust",),
    "Ruby": ("ruby",),
    "PHP": ("php",),
    "Kotlin": ("kotlin",),
    "Swift": ("swift",),
    "SQL": ("sql",),
    # Web frameworks and front end
    "FastAPI": ("fastapi",),
    "Django": ("django",),
    "Flask": ("flask",),
    "React": ("react", "react.js", "reactjs"),
    "Angular": ("angular",),
    "Vue.js": ("vue.js", "vuejs"),
    "Next.js": ("next.js", "nextjs"),
    "Node.js": ("node.js", "nodejs"),
    "Spring Boot": ("spring boot",),
    "Tailwind CSS": ("tailwind css", "tailwindcss"),
    "Pydantic": ("pydantic",),
    "Pytest": ("pytest",),
    # Data stores
    "PostgreSQL": ("postgresql", "postgres"),
    "MySQL": ("mysql",),
    "MongoDB": ("mongodb",),
    "Redis": ("redis",),
    "SQLite": ("sqlite",),
    "Elasticsearch": ("elasticsearch",),
    # Cloud and DevOps
    "AWS": ("aws", "amazon web services"),
    "Azure": ("azure",),
    "Google Cloud": ("gcp", "google cloud platform"),
    "Docker": ("docker",),
    "Kubernetes": ("kubernetes", "k8s"),
    "Terraform": ("terraform",),
    "CI/CD": ("ci/cd", "ci cd"),
    "Linux": ("linux",),
    "Git": ("git",),
    # APIs and practices
    "REST APIs": ("rest api", "rest apis", "restful api", "restful apis"),
    "GraphQL": ("graphql",),
    "Microservices": ("microservices", "microservice"),
    "Agile": ("agile", "scrum"),
    # AI and data
    "Machine Learning": ("machine learning",),
    "Deep Learning": ("deep learning",),
    "NLP": ("nlp", "natural language processing"),
    "PyTorch": ("pytorch",),
    "TensorFlow": ("tensorflow",),
    "scikit-learn": ("scikit-learn", "sklearn"),
    "pandas": ("pandas",),
    "NumPy": ("numpy",),
    "spaCy": ("spacy",),
    "LangChain": ("langchain",),
    "Hugging Face": ("hugging face", "huggingface"),
    "Sentence Transformers": ("sentence transformers", "sentence-transformers"),
    "FAISS": ("faiss",),
}


def _pattern_for(alias: str) -> re.Pattern[str]:
    # Boundaries stop "sql" matching inside "postgresql" and "git" inside "github".
    return re.compile(r"(?<![\w+#.])" + re.escape(alias) + r"(?![\w+#])", re.IGNORECASE)


@lru_cache(maxsize=1)
def _compiled() -> tuple[tuple[str, tuple[re.Pattern[str], ...]], ...]:
    return tuple(
        (canonical, tuple(_pattern_for(alias) for alias in aliases))
        for canonical, aliases in SKILL_ALIASES.items()
    )


def extract_skills(text: str) -> list[str]:
    """Return canonical skill names found in text, in vocabulary order."""
    if not text:
        return []
    found: list[str] = []
    for canonical, patterns in _compiled():
        if any(p.search(text) for p in patterns):
            found.append(canonical)
    return found


def canonical_name(term: str) -> str | None:
    """Map a single term to its canonical skill name, or None if unknown."""
    normalized = term.strip().lower()
    for canonical, aliases in SKILL_ALIASES.items():
        if normalized == canonical.lower() or normalized in aliases:
            return canonical
    return None
