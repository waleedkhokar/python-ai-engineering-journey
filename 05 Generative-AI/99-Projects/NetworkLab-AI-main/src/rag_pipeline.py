from __future__ import annotations

from src.chunking import split_text
from src.vector_store import LocalVectorStore


class RAGPipeline:
    """Coordinates chunking, indexing, retrieval, and source metadata."""
    def __init__(self):
        self.store = LocalVectorStore()
        self._next_chunk_id = 1
        self._documents: set[str] = set()

    @property
    def chunk_count(self) -> int:
        return len(self.store.records)

    @property
    def document_count(self) -> int:
        return len(self._documents)

    def add_document(self, source: str, pages: list[dict]) -> int:
        if source in self._documents:
            return 0
        records = []
        for page_record in pages:
            page_number = int(page_record.get("page", 1))
            for chunk in split_text(page_record.get("text", "")):
                records.append(
                    {
                        "chunk_id": self._next_chunk_id,
                        "source": source,
                        "page": page_number,
                        "text": chunk,
                    }
                )
                self._next_chunk_id += 1
        if records:
            self.store.add(records)
            self._documents.add(source)
        return len(records)

    def search(self, question: str, top_k: int = 5) -> list[dict]:
        return self.store.search(question, top_k=top_k)

    def clear(self) -> None:
        self.store.clear()
        self._documents.clear()
        self._next_chunk_id = 1
