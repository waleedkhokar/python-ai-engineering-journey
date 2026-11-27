from __future__ import annotations

import os
import re
from collections import Counter

import numpy as np


class EmbeddingModel:
    """
    Pluggable text embedding model.

    Default mode uses a compact TF-IDF representation for easy local setup.
    Optional mode uses Sentence Transformers for semantic embeddings.
    Set NETWORKLAB_EMBEDDING_MODE=sentence-transformers to enable it.
    """
    def __init__(self):
        self.mode = os.getenv("NETWORKLAB_EMBEDDING_MODE", "tfidf").lower()
        self.vocabulary: dict[str, int] = {}
        self.model = None
        self.document_frequency = Counter()
        if self.mode == "sentence-transformers":
            try:
                from sentence_transformers import SentenceTransformer
            except ImportError as exc:
                raise RuntimeError(
                    "Semantic mode requires optional packages. Install requirements-semantic.txt."
                ) from exc
            model_name = os.getenv(
                "NETWORKLAB_SENTENCE_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
            )
            self.model = SentenceTransformer(model_name)
        elif self.mode != "tfidf":
            raise ValueError("NETWORKLAB_EMBEDDING_MODE must be 'tfidf' or 'sentence-transformers'.")

    @staticmethod
    def tokenize(text: str) -> list[str]:
        return re.findall(r"[a-zA-Z0-9]+", text.lower())

    @staticmethod
    def normalize(matrix: np.ndarray) -> np.ndarray:
        if matrix.size == 0:
            return matrix.astype(np.float32)
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return (matrix / norms).astype(np.float32)

    def fit_transform(self, texts: list[str]) -> np.ndarray:
        if self.model is not None:
            vectors = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            return vectors.astype(np.float32)

        tokenized = [self.tokenize(text) for text in texts]
        vocabulary = sorted({token for tokens in tokenized for token in tokens})
        self.vocabulary = {token: index for index, token in enumerate(vocabulary)}
        self.document_frequency = Counter()
        for tokens in tokenized:
            self.document_frequency.update(set(tokens))

        matrix = np.zeros((len(texts), len(vocabulary)), dtype=np.float32)
        total_docs = max(len(texts), 1)
        for row, tokens in enumerate(tokenized):
            counts = Counter(tokens)
            for token, count in counts.items():
                column = self.vocabulary[token]
                tf = count / max(len(tokens), 1)
                idf = np.log((1 + total_docs) / (1 + self.document_frequency[token])) + 1
                matrix[row, column] = tf * idf
        return self.normalize(matrix)

    def transform(self, texts: list[str]) -> np.ndarray:
        if self.model is not None:
            vectors = self.model.encode(texts, convert_to_numpy=True, normalize_embeddings=True)
            return vectors.astype(np.float32)

        if not self.vocabulary:
            return np.zeros((len(texts), 0), dtype=np.float32)
        matrix = np.zeros((len(texts), len(self.vocabulary)), dtype=np.float32)
        for row, text in enumerate(texts):
            tokens = self.tokenize(text)
            counts = Counter(tokens)
            for token, count in counts.items():
                if token in self.vocabulary:
                    matrix[row, self.vocabulary[token]] = count / max(len(tokens), 1)
        return self.normalize(matrix)
