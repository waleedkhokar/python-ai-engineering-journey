import json
import httpx
from pydantic import ValidationError
from app.prompts.triage_prompt import SYSTEM_PROMPT, USER_TEMPLATE
from app.schemas.triage import TriageRequest, TriageResult
from app.services.fallback import deterministic_fallback
from app.services.llm_client import LLMClient

class TriageService:
    def __init__(self):
        self.llm = LLMClient()

    async def analyze(self, request: TriageRequest) -> TriageResult:
        schema = TriageResult.model_json_schema()
        prompt = USER_TEMPLATE.format(
            language=request.language.value,
            message=request.message,
            known_facts=json.dumps(request.known_facts, ensure_ascii=False),
            documents=json.dumps(request.documents, ensure_ascii=False),
            timeline=json.dumps(request.timeline, ensure_ascii=False),
            legal_sources=json.dumps(request.legal_sources, ensure_ascii=False),
        )

        try:
            raw = await self.llm.complete_json(SYSTEM_PROMPT, prompt, schema)
            result = TriageResult.model_validate(raw)
            self._enforce_source_boundary(result, request)
            self._ensure_disclaimer(result)
            return result
        except (RuntimeError, ValidationError, KeyError, ValueError, httpx.HTTPError):
            return deterministic_fallback(request)

    @staticmethod
    def _enforce_source_boundary(result, request):
        allowed = {
            str(source.get("id"))
            for source in request.legal_sources
            if source.get("id") is not None
        }
        result.source_ids_used = [
            sid for sid in result.source_ids_used if sid in allowed
        ]

    @staticmethod
    def _ensure_disclaimer(result):
        result.disclaimer = (
            "This is an AI-generated intake/triage summary, not a legal opinion. "
            "Verify important facts, deadlines and legal sources with a qualified "
            "lawyer or the relevant authority."
        )
