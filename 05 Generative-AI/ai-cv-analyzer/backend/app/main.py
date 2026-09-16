from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import analysis

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered CV Analyzer and Job Matcher Backend",
    version="1.0.0",
)

# Configure CORS so your frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis.router)


@app.get("/")
def root():
  return {
      "message": "Welcome to the AI CV Analyzer API! Head over to /docs for Swagger API documentation."
  }