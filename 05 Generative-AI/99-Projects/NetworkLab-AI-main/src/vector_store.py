from __future__ import annotations

import numpy as np

from src.embeddings import EmbeddingModel


class LocalVectorStore:
    """Small in-memory vector index using cosine similarity."""
    def __init__(self):
        self.embedder = EmbeddingModel()
        self.records: list[dict] = []
        self.vectors = np.zeros((0, 0), dtype=np.float32)

    def add(self, records: list[dict]) -> None:
        if not records:
            return
        self.records.extend(records)
        self.vectors = self.embedder.fit_transform([item["text"] for item in self.records])

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        if not self.records or self.vectors.size == 0:
            return []
        query_vector = self.embedder.transform([query])
        if query_vector.size == 0:
            return []
        scores = self.vectors @ query_vector[0]
        indices = np.argsort(scores)[::-1][:top_k]
        results = []
        for index in indices:
            score = float(scores[index])
            if score > 0:
                result = dict(self.records[int(index)])
                result["score"] = score
                results.append(result)
        return results

    def clear(self) -> None:
        self.records.clear()
        self.vectors = np.zeros((0, 0), dtype=np.float32)
        self.embedder = EmbeddingModel()
