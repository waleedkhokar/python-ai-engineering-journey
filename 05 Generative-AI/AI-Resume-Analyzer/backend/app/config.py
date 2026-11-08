"""Application settings loaded from environment variables."""
import os
from dataclasses import dataclass


def _env_list(name: str, default: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


@dataclass(frozen=True)
class Settings:
    cors_origins: list[str]
    max_upload_bytes: int
    spacy_model: str
    embedding_model: str
    use_embeddings: bool
    similarity_threshold: float


settings = Settings(
    cors_origins=_env_list("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173"),
    max_upload_bytes=int(os.getenv("MAX_UPLOAD_MB", "10")) * 1024 * 1024,
    spacy_model=os.getenv("SPACY_MODEL", "en_core_web_sm"),
    embedding_model=os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2"),
    use_embeddings=os.getenv("USE_EMBEDDINGS", "true").lower() == "true",
    similarity_threshold=float(os.getenv("SIMILARITY_THRESHOLD", "0.65")),
)
