from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "services" / "legal-rag"))
from core import chunk_text, lexical_score  # noqa: E402

sample = """Section 1 Short title. This fixture is synthetic test text and is not a legal source. """ + " citizen property dispute evidence " * 220
chunks = chunk_text(sample, target_words=120, overlap_words=20)
assert len(chunks) >= 2, "chunker did not split long text"
assert all(chunk["content_hash"] for chunk in chunks), "chunk hash missing"
assert chunks[0]["section_or_article"].lower().startswith("section 1"), "section hint not detected"
assert lexical_score("property evidence", chunks[0]["content"]) > lexical_score("airplane weather", chunks[0]["content"]), "lexical ranking failed"
print(f"PASS member4 core — {len(chunks)} synthetic chunks, section detection and lexical ranking verified.")

# Empty indexes must not be mistaken for retrieval-ready corpus state.
empty = ROOT / "data" / "rag_index" / "_empty_test.jsonl"
empty.parent.mkdir(parents=True, exist_ok=True)
empty.write_text("", encoding="utf-8")
from core import search_jsonl  # noqa: E402
assert search_jsonl(empty, "property", 5) == [], "empty index should return no chunks"
empty.unlink()
print("PASS member4 readiness — empty index cannot fabricate retrieval results.")

# FastAPI contract: health must distinguish an empty file from a ready index,
# and metadata fallback must never surface quarantined placeholder judgments.
import importlib.util
import tempfile
from fastapi.testclient import TestClient

app_path = ROOT / "services" / "legal-rag" / "app.py"
spec = importlib.util.spec_from_file_location("pjn_legal_rag_app", app_path)
assert spec and spec.loader
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)

with tempfile.TemporaryDirectory() as temp_dir:
    temp_index = Path(temp_dir) / "empty.jsonl"
    temp_index.write_text("", encoding="utf-8")
    app_module.INDEX_PATH = temp_index
    client = TestClient(app_module.app)

    health = client.get("/health")
    assert health.status_code == 200
    health_body = health.json()
    assert health_body["index_file_present"] is True
    assert health_body["index_ready"] is False
    assert health_body["local_chunk_count"] == 0

    search = client.post("/v1/search", json={"query": "property transfer", "limit": 6})
    assert search.status_code == 200
    body = search.json()
    assert body["mode"] == "metadata-only"
    assert "warning" in body
    assert all(not item["document_id"].startswith("SHC-") for item in body["results"]), "placeholder judgment leaked into fallback"
    assert all(item["evidence_level"] == "metadata" for item in body["results"])
    assert all("bench" in item for item in body["results"]), "judgment bench field missing from search contract"

print("PASS member4 API — health readiness and metadata-only quarantine verified.")

# Acquisition routing must respect corpus categories as new verified sources are added.
fetch_path = ROOT / "scripts" / "fetch_initial_official_docs.py"
fetch_spec = importlib.util.spec_from_file_location("pjn_fetch_official", fetch_path)
assert fetch_spec and fetch_spec.loader
fetch_module = importlib.util.module_from_spec(fetch_spec)
fetch_spec.loader.exec_module(fetch_module)

base_row = {
    "document_id": "PK-099", "document_type": "Act", "court": "", "jurisdiction": "Federal", "file_name": "federal.pdf"
}
assert fetch_module.destination(base_row).parent.name == "federal_laws"
assert fetch_module.destination({**base_row, "document_id": "SD-099", "jurisdiction": "Sindh", "file_name": "sindh.pdf"}).parent.name == "sindh_laws"
assert fetch_module.destination({**base_row, "document_id": "J-001", "document_type": "Judgment", "court": "Supreme Court of Pakistan", "file_name": "sc.pdf"}).parent.name == "supreme_court"
assert fetch_module.destination({**base_row, "document_id": "J-002", "document_type": "Judgment", "court": "Sindh High Court", "jurisdiction": "Sindh", "file_name": "shc.pdf"}).parent.name == "sindh"
print("PASS member4 acquisition — future verified sources route to the correct corpus category.")
