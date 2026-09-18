from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the absolute path of the backend directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Ops Assistant"
    DATABASE_URL: str
    GEMINI_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Explicitly point to backend/.env using pathlib
    model_config = SettingsConfigDict(env_file=str(BASE_DIR / ".env"), extra="ignore")

settings = Settings()
# from pydantic_settings import BaseSettings

# class Settings(BaseSettings):
#     PROJECT_NAME: str = "AI-Ops Assistant"
#     DATABASE_URL: str
#     REDIS_URL: str = "redis://localhost:6379"
#     OPENAI_API_KEY: str
#     SECRET_KEY: str
#     ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

#     class Config:
#         env_file = ".env"

# settings = Settings()