import httpx
from fastapi.testclient import TestClient
from app.main import app
from app.services.llm_client import LLMClient

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_triage_without_llm_uses_fallback():
    response = client.post(
        "/api/v1/triage",
        json={
            "message": "Mere chacha ne hamari inherited property par qabza kar liya hai.",
            "language": "roman_urdu",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert "category" in body
    assert "follow_up_questions" in body
    assert "disclaimer" in body

def test_llm_transport_error_uses_fallback_instead_of_502(monkeypatch):
    async def unreachable(*args, **kwargs):
        raise httpx.ConnectError("LLM provider unreachable")

    monkeypatch.setattr(LLMClient, "complete_json", unreachable)
    response = client.post(
        "/api/v1/triage",
        json={
            "message": "Mere chacha ne hamari inherited property par qabza kar liya hai.",
            "language": "roman_urdu",
        },
    )
    assert response.status_code == 200
    assert response.json()["category"] == "Property / Inheritance"
