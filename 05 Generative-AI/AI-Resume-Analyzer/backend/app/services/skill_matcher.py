"""Skill matching between a resume and a job description.

Matching works in two passes:
1. Exact matches on canonical skill names (for example "Postgres" -> "PostgreSQL").
2. Semantic matches using sentence-transformer embeddings, when the model is available.
   Semantic matching is a supporting signal and is skipped if the model cannot be loaded.
"""
from __future__ import annotations

import logging

from app.config import settings
from app.schemas import SkillComparison, SkillMatch

logger = logging.getLogger(__name__)


class SkillMatcher:
    def __init__(self, use_embeddings: bool | None = None, threshold: float | None = None) -> None:
        self.use_embeddings = settings.use_embeddings if use_embeddings is None else use_embeddings
        self.threshold = settings.similarity_threshold if threshold is None else threshold
        self._model = None
        self._model_failed = False

    @property
    def model(self):
        if not self.use_embeddings or self._model_failed:
            return None
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer

                self._model = SentenceTransformer(settings.embedding_model)
            except Exception as exc:  # model download or import problems should not break analysis
                logger.warning("Embedding model unavailable, using exact matching only: %s", exc)
                self._model_failed = True
                return None
        return self._model

    def _best_semantic_match(self, skill: str, candidates: list[str]) -> tuple[str | None, float]:
        model = self.model
        if model is None or not candidates:
            return None, 0.0
        from sentence_transformers import util

        query = model.encode(skill, convert_to_tensor=True)
        vectors = model.encode(candidates, convert_to_tensor=True)
        scores = util.cos_sim(query, vectors)[0]
        best = int(scores.argmax())
        return candidates[best], float(scores[best])

    def compare(
        self,
        resume_skills: list[str],
        required_skills: list[str],
        nice_to_have_skills: list[str] | None = None,
    ) -> SkillComparison:
        nice_to_have_skills = nice_to_have_skills or []
        resume_set = {s.lower(): s for s in resume_skills}
        matches: list[SkillMatch] = []
        missing: list[str] = []

        for skill in required_skills + [s for s in nice_to_have_skills if s not in required_skills]:
            if skill.lower() in resume_set:
                matches.append(SkillMatch(skill=skill, match_score=1.0, method="exact"))
                continue
            if skill in required_skills:
                best, score = self._best_semantic_match(skill, resume_skills)
                if best is not None and score >= self.threshold:
                    matches.append(SkillMatch(skill=skill, match_score=round(score, 3), method="semantic"))
                    continue
                missing.append(skill)

        matched_names = {m.skill.lower() for m in matches}
        required_matched = sum(1 for s in required_skills if s.lower() in matched_names)
        percentage = (required_matched / len(required_skills) * 100) if required_skills else 0.0
        job_names = {s.lower() for s in required_skills + nice_to_have_skills}
        additional = [s for s in resume_skills if s.lower() not in job_names]

        return SkillComparison(
            matching_skills=matches,
            missing_skills=missing,
            additional_skills=additional,
            match_percentage=round(percentage, 1),
        )
