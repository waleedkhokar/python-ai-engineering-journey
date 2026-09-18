import time
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

class SupportAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash",
            google_api_key=settings.GEMINI_API_KEY,
            temperature=0.3
        )
        
        self.system_prompt = (
            "You are a professional enterprise customer support and product specialist "
            "for an AI-Ops platform. Provide clear, helpful answers with markdown formatting "
            "like bolding and bullet points when discussing specifications, stock, or pricing."
        )

    def run(self, query: str) -> str:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                prompt = f"{self.system_prompt}\n\nUser Question: {query}"
                response = self.llm.invoke(prompt)
                return response.content
            except Exception as e:
                if "429" in str(e) or "ResourceExhausted" in str(e):
                    if attempt < max_retries - 1:
                        sleep_time = (attempt + 1) * 5
                        print(f"Rate limit hit on support. Retrying in {sleep_time} seconds...")
                        time.sleep(sleep_time)
                        continue
                return f"Sorry, I encountered an error connecting to the support agent: {str(e)}"

support_agent = SupportAgent()