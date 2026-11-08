from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="Pakistan Justice Navigator - AI Legal Triage",
    version="0.1.0",
    description="Structured legal-intake triage service. Not a substitute for a lawyer.",
)
app.include_router(router, prefix="/api/v1")

@app.get("/health")
def health():
    return {"status": "ok", "module": "ai-legal-triage"}
