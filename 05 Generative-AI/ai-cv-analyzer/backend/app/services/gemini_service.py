from google import genai
from google.genai import types
from app.config import settings
from app.schemas.analysis_schema import CVAnalysisResponse


class GeminiService:

  def __init__(self):
    # Initialize the official Google GenAI client
    self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
    # Using a fast and cost-effective model model version
    self.model_name = "gemini-3.6-flash"

  def analyze_cv(self, cv_text: str, job_description: str) -> CVAnalysisResponse:
    prompt = f"""
        You are an expert technical recruiter, ATS specialist, and hiring manager. 
        Analyze the following Candidate CV against the provided Job Description (JD).

        === JOB DESCRIPTION ===
        {job_description}

        === CANDIDATE CV ===
        {cv_text}

        Evaluate the match thoroughly and objectively. Provide the match score, matching skills, missing skills, experience gaps, potential ATS issues, actionable improvements to secure the role, and relevant technical/behavioral interview questions.
        """

    # Call Gemini with structured outputs forced to match our Pydantic schema
    response = self.client.models.generate_content(
        model=self.model_name,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=CVAnalysisResponse,
            temperature=0.2,  # Low temperature for analytical consistency
        ),
    )

    # response.parsed automatically maps the JSON result directly into the Pydantic model
    return response.parsed