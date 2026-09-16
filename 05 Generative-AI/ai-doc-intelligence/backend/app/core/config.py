import os
from dotenv import load_dotenv

# Load variables from backend/.env
load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is missing from backend/.env file!")

settings = Settings()