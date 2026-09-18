from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- Import this
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, support, analytics

# Automatically create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Unified Enterprise AI System combining Support RAG and Admin Text-to-SQL Analytics.",
    version="1.0.0"
)

# --- ADD THIS CORS MIDDLEWARE BLOCK ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including OPTIONS, POST, GET
    allow_headers=["*"],  # Allows all headers
)
# -------------------------------------

# Include All Routers
app.include_router(auth.router)
app.include_router(support.router)
app.include_router(analytics.router)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "message": "Welcome to AI-Ops Assistant API",
        "status": "online"
    }