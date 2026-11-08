from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.api.candidates import router as candidate_router
from app.api.calls import router as call_router
from app.api.verification import router as verification_router
from app.api.screening import router as screening_router
from app.api.scheduling import router as scheduling_router
from app.api.webhooks import router as webhook_router
from app import models


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Recruiter Voice Assistant",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(candidate_router)
app.include_router(call_router)
app.include_router(verification_router)
app.include_router(screening_router)
app.include_router(scheduling_router)
app.include_router(webhook_router)

@app.get("/")
async def root():
    return {"message": "AI Recruiter backend is running..."}


@app.get('/health')
async def health_check():
    return {"status": "healthy"}