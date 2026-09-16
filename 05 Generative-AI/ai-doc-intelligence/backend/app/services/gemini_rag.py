# import time
# import uuid
# import logging
# from typing import Generator, List, Dict, Optional

# from google import genai
# from google.genai import types
# from qdrant_client import QdrantClient
# from qdrant_client.models import (
#     Distance,
#     VectorParams,
#     PointStruct,
#     Filter,
#     FieldCondition,
#     MatchValue,
# )
# from app.core.config import settings

# logger = logging.getLogger("uvicorn.error")

# # Initialize Google Gen AI Client
# ai_client = genai.Client(api_key=settings.GEMINI_API_KEY)

# # Initialize Qdrant in-memory vector database
# qdrant = QdrantClient(":memory:")
# COLLECTION_NAME = "doc_chunks"


# def init_vector_db():
#     """Create Qdrant collection if it does not exist."""
#     collections = [c.name for c in qdrant.get_collections().collections]
#     if COLLECTION_NAME not in collections:
#         qdrant.create_collection(
#             collection_name=COLLECTION_NAME,
#             vectors_config=VectorParams(size=768, distance=Distance.COSINE),
#         )


# init_vector_db()


# def get_embeddings_batch(texts: List[str], retries: int = 3) -> List[List[float]]:
#     """Generate 768-dim embeddings in a single batch request using valid model IDs."""
#     if not texts:
#         return []

#     # Using valid Gemini API SDK model names
#     primary_model = "text-embedding-004"
#     fallback_model = "gemini-embedding-001"

#     for attempt in range(retries):
#         try:
#             response = ai_client.models.embed_content(
#                 model=primary_model,
#                 contents=texts,
#                 config=types.EmbedContentConfig(output_dimensionality=768),
#             )
#             return [e.values for e in response.embeddings]
#         except Exception as e:
#             logger.warning(f"Embedding attempt {attempt + 1} with {primary_model} failed: {e}")
#             if attempt == retries - 1:
#                 # Fallback model attempt if primary model fails
#                 try:
#                     logger.info(f"Retrying with fallback model: {fallback_model}")
#                     fallback_res = ai_client.models.embed_content(
#                         model=fallback_model,
#                         contents=texts,
#                         config=types.EmbedContentConfig(output_dimensionality=768),
#                     )
#                     return [e.values for e in fallback_res.embeddings]
#                 except Exception as fallback_err:
#                     raise fallback_err
#             time.sleep(2 ** attempt)


# def store_doc_chunks(doc_id: str, chunks: list[dict]):
#     """Embed document text chunks in batches and upload to Qdrant."""
#     valid_chunks = [c for c in chunks if c.get("text", "").strip()]
#     if not valid_chunks:
#         return

#     texts = [c["text"] for c in valid_chunks]
    
#     # Process in batches of 16 to avoid payload limits
#     batch_size = 16
#     all_embeddings = []
    
#     for i in range(0, len(texts), batch_size):
#         batch_texts = texts[i : i + batch_size]
#         embeddings = get_embeddings_batch(batch_texts)
#         all_embeddings.extend(embeddings)

#     points = []
#     for chunk, vector in zip(valid_chunks, all_embeddings):
#         metadata = chunk.get("metadata", {})
#         page_num = metadata.get("page_number", 1) if isinstance(metadata, dict) else 1

#         points.append(
#             PointStruct(
#                 id=str(uuid.uuid4()),
#                 vector=vector,
#                 payload={
#                     "doc_id": doc_id,
#                     "text": chunk["text"],
#                     "page_number": page_num,
#                 },
#             )
#         )

#     if points:
#         qdrant.upsert(collection_name=COLLECTION_NAME, points=points)


# def stream_rag_answer(
#     doc_id: str, 
#     question: str, 
#     chat_history: Optional[List[Dict[str, str]]] = None
# ) -> Generator[str, None, None]:
#     """Retrieve top vector matches and stream response."""
#     try:
#         query_embeddings = get_embeddings_batch([question])
#         if not query_embeddings:
#             yield "Failed to generate query embedding."
#             return
            
#         query_vector = query_embeddings[0]

#         search_filter = Filter(
#             must=[
#                 FieldCondition(
#                     key="doc_id",
#                     match=MatchValue(value=doc_id),
#                 )
#             ]
#         )

#         query_response = qdrant.query_points(
#             collection_name=COLLECTION_NAME,
#             query=query_vector,
#             query_filter=search_filter,
#             limit=12,
#         )

#         context_chunks = []
#         for point in query_response.points:
#             page = point.payload.get("page_number", "?")
#             text = point.payload.get("text", "")
#             context_chunks.append(f"[Page {page}]: {text}")

#         context_str = "\n\n".join(context_chunks) if context_chunks else "No relevant context found in document."

#         history_str = ""
#         if chat_history:
#             formatted_history = []
#             for msg in chat_history[-6:]:
#                 role = "User" if msg.get("role") == "user" else "Assistant"
#                 formatted_history.append(f"{role}: {msg.get('content', '')}")
#             history_str = "CHAT HISTORY:\n" + "\n".join(formatted_history) + "\n\n"

#         prompt = f"""You are an expert document intelligence assistant.
# Analyze the provided document contexts below carefully to answer the user's question accurately.

# DOCUMENT CONTEXT:
# {context_str}

# {history_str}USER QUESTION:
# {question}

# INSTRUCTIONS:
# 1. Answer directly and comprehensively based on the document contexts provided above.
# 2. When the user requests a summary, overall status, totals, or trends, synthesize all relevant context chunks together.
# 3. Always cite page numbers when referencing specific facts or table data (e.g., [Page X]).
# 4. If a specific detail is genuinely missing from the document context, state what information is available first before noting any missing specifics."""

#         response = ai_client.models.generate_content_stream(
#             model="gemini-3.6-flash"",
#             contents=prompt,
#         )

#         for chunk in response:
#             if chunk.text:
#                 yield chunk.text

#     except Exception as e:
#         logger.error(f"Error during RAG streaming: {str(e)}", exc_info=True)
#         yield f"\n\n[System Error: {str(e)}]"
import time
import uuid
import logging
from typing import Generator, List, Dict, Optional

from google import genai
from google.genai import types
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

# Initialize Google Gen AI Client
ai_client = genai.Client(api_key=settings.GEMINI_API_KEY)

# Initialize Qdrant in-memory vector database
qdrant = QdrantClient(":memory:")
COLLECTION_NAME = "doc_chunks"


def init_vector_db():
    """Create Qdrant collection if it does not exist."""
    collections = [c.name for c in qdrant.get_collections().collections]
    if COLLECTION_NAME not in collections:
        qdrant.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(size=768, distance=Distance.COSINE),
        )


init_vector_db()


def get_embeddings_batch(texts: List[str], retries: int = 3) -> List[List[float]]:
    """Generate 768-dim embeddings using valid Google GenAI SDK models."""
    if not texts:
        return []

    primary_model = "text-embedding-004"
    fallback_model = "gemini-embedding-001"

    for attempt in range(retries):
        try:
            response = ai_client.models.embed_content(
                model=primary_model,
                contents=texts,
                config=types.EmbedContentConfig(output_dimensionality=768),
            )
            return [e.values for e in response.embeddings]
        except Exception as e:
            logger.warning(f"Embedding attempt {attempt + 1} with {primary_model} failed: {e}")
            if attempt == retries - 1:
                try:
                    logger.info(f"Retrying with fallback model: {fallback_model}")
                    fallback_res = ai_client.models.embed_content(
                        model=fallback_model,
                        contents=texts,
                        config=types.EmbedContentConfig(output_dimensionality=768),
                    )
                    return [e.values for e in fallback_res.embeddings]
                except Exception as fallback_err:
                    raise fallback_err
            time.sleep(2 ** attempt)


def store_doc_chunks(doc_id: str, chunks: list[dict]):
    """Embed document text chunks in batches and upload to Qdrant."""
    valid_chunks = [c for c in chunks if c.get("text", "").strip()]
    if not valid_chunks:
        return

    texts = [c["text"] for c in valid_chunks]
    
    batch_size = 16
    all_embeddings = []
    
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i : i + batch_size]
        embeddings = get_embeddings_batch(batch_texts)
        all_embeddings.extend(embeddings)

    points = []
    for chunk, vector in zip(valid_chunks, all_embeddings):
        metadata = chunk.get("metadata", {})
        page_num = metadata.get("page_number", 1) if isinstance(metadata, dict) else 1

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=vector,
                payload={
                    "doc_id": doc_id,
                    "text": chunk["text"],
                    "page_number": page_num,
                },
            )
        )

    if points:
        qdrant.upsert(collection_name=COLLECTION_NAME, points=points)


def stream_rag_answer(
    doc_id: str, 
    question: str, 
    chat_history: Optional[List[Dict[str, str]]] = None
) -> Generator[str, None, None]:
    """Retrieve top vector matches and stream response using gemini-3.6-flash."""
    try:
        query_embeddings = get_embeddings_batch([question])
        if not query_embeddings:
            yield "Failed to generate query embedding."
            return
            
        query_vector = query_embeddings[0]

        search_filter = Filter(
            must=[
                FieldCondition(
                    key="doc_id",
                    match=MatchValue(value=doc_id),
                )
            ]
        )

        query_response = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_vector,
            query_filter=search_filter,
            limit=12,
        )

        context_chunks = []
        for point in query_response.points:
            page = point.payload.get("page_number", "?")
            text = point.payload.get("text", "")
            context_chunks.append(f"[Page {page}]: {text}")

        context_str = "\n\n".join(context_chunks) if context_chunks else "No relevant context found in document."

        history_str = ""
        if chat_history:
            formatted_history = []
            for msg in chat_history[-6:]:
                role = "User" if msg.get("role") == "user" else "Assistant"
                formatted_history.append(f"{role}: {msg.get('content', '')}")
            history_str = "CHAT HISTORY:\n" + "\n".join(formatted_history) + "\n\n"

        prompt = f"""You are an expert document intelligence assistant.
Analyze the provided document contexts below carefully to answer the user's question accurately.

DOCUMENT CONTEXT:
{context_str}

{history_str}USER QUESTION:
{question}

INSTRUCTIONS:
1. Answer directly and comprehensively based on the document contexts provided above.
2. When the user requests a summary, overall status, totals, or trends, synthesize all relevant context chunks together.
3. Always cite page numbers when referencing specific facts or table data (e.g., [Page X]).
4. If a specific detail is genuinely missing from the document context, state what information is available first before noting any missing specifics."""

        # Updated model name to gemini-3.6-flash
        response = ai_client.models.generate_content_stream(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        logger.error(f"Error during RAG streaming: {str(e)}", exc_info=True)
        yield f"\n\n[System Error: {str(e)}]"