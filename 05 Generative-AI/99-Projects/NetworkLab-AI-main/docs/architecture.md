# Architecture Notes

## Main components

- `document_loader.py`: extracts text from PDF and TXT files and preserves page metadata.
- `chunking.py`: creates overlapping chunks for retrieval.
- `embeddings.py`: exposes a pluggable embedding interface. TF-IDF is the default; Sentence Transformers is optional.
- `vector_store.py`: stores vectors and metadata in memory and ranks matches with cosine similarity.
- `rag_pipeline.py`: coordinates document ingestion and retrieval.
- `llm_client.py`: sends the user question and retrieved context to Groq when configured.
- `network_tools.py`: provides local networking learning utilities.
- `app.py`: Streamlit user interface and session-level interaction.

## Retrieval flow

1. The document loader extracts page text.
2. The chunker splits each page into overlapping passages.
3. The embedding provider transforms passages into vectors.
4. The vector store retains vectors alongside source, page, and chunk metadata.
5. A question is embedded with the same provider.
6. Cosine similarity ranks candidate passages.
7. Retrieved context is optionally passed to the LLM.
8. The UI displays retrieved source references.

## Design decisions

The starter project favors a small, inspectable codebase and easy local installation. The default TF-IDF mode avoids large model downloads. The optional Sentence Transformers mode offers semantic retrieval for a more advanced deployment.

## Future improvements

- Persistent vector storage (FAISS, Chroma, or another vector database).
- OCR support for scanned lab manuals.
- More robust source-level citation formatting.
- Additional Cisco IOS command coverage and configuration linting.
- Authentication and per-user document isolation for hosted deployments.
- Evaluation dataset for retrieval relevance and answer faithfulness.


## Developer profile

The Project Overview page includes a developer profile and links to Hammal Baloch's portfolio, GitHub, and LinkedIn.
