# 14 — SQL for AI Engineering

## 🎯 Goals
- Let LLMs work with structured data safely
- Build Text-to-SQL and SQL agent workflows
- Combine SQL with RAG and vector search
- Apply strict safety and permission boundaries

## 📚 Topics
1. Why SQL matters in AI systems
2. Text-to-SQL pipeline
3. Schema retrieval and prompting
4. SQL agents and tools
5. SQL safety and validation
6. pgvector and hybrid search
7. RAG with structured + unstructured data
8. Evaluation and observability

---

## 1. Architecture

```text
User → AI Agent → Tool → SQL Generator → Validator → Database (read-only)
                                                  ↓
User ← LLM ← Query Result ←─────────────────────────┘
```

## 2. Text-to-SQL Pipeline

```text
Question → Retrieve relevant schema → Prompt LLM → Generate SQL
→ Validate → Execute (read-only, limits) → Summarize result → Answer
```

Prompt ingredients:
- Relevant table/column definitions and types
- Foreign-key relationships
- Sample values / enum meanings
- Business definitions (e.g. "revenue excludes cancelled orders")
- Few-shot question → SQL examples
- Dialect (PostgreSQL) and output format rules

## 3. Safety (Critical)

> An LLM generating SQL does **not** mean the SQL should be executed without validation and permission controls.

Checklist:

- **Read-only database role** (`GRANT SELECT` only, no DDL/DML)
- Restrict to specific schemas/views (expose curated views, not raw tables)
- Parse and validate SQL (single statement, `SELECT` only) — e.g. with `sqlglot`
- Block dangerous functions (`pg_read_file`, `COPY`, `dblink`, etc.)
- Enforce `statement_timeout` and `LIMIT`
- Row-level security for multi-tenant data
- Mask or exclude PII columns
- Audit-log every generated query
- Human approval for anything that writes
- Treat retrieved data and user text as **untrusted** (prompt injection)

```sql
CREATE ROLE llm_readonly LOGIN PASSWORD '...';
GRANT USAGE ON SCHEMA analytics TO llm_readonly;
GRANT SELECT ON analytics.v_orders, analytics.v_customers TO llm_readonly;
ALTER ROLE llm_readonly SET statement_timeout = '5s';
ALTER ROLE llm_readonly SET default_transaction_read_only = on;
```

Validation sketch:

```python
import sqlglot
from sqlglot import exp

def validate(sql: str):
    trees = sqlglot.parse(sql, read="postgres")
    if len(trees) != 1 or not isinstance(trees[0], exp.Select):
        raise ValueError("Only a single SELECT is allowed")
```

## 4. SQL Agent Loop

```text
1. Inspect schema (tool: list_tables, describe_table)
2. Draft query
3. Run EXPLAIN / dry validation
4. Execute with limits
5. On error: read message, fix, retry (bounded attempts)
6. Answer with the SQL shown for transparency
```

Frameworks: LangChain SQL agents, LlamaIndex, custom tool-calling with any LLM API, MCP database servers.

## 5. pgvector

```sql
CREATE EXTENSION vector;

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    content TEXT,
    metadata JSONB,
    embedding VECTOR(1536)
);

CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);

SELECT id, content
FROM documents
ORDER BY embedding <=> '[0.01, 0.02, ...]'
LIMIT 5;
```

Index choices: **HNSW** (better recall/speed, more memory) vs **IVFFlat** (faster to build).
Operators: `<->` L2, `<=>` cosine, `<#>` inner product.

## 6. Hybrid Search & RAG

```text
Query → embed → vector search (pgvector)
      → keyword search (full-text)     → merge / re-rank → LLM context
      → metadata filters (SQL WHERE)
```

- Combine **structured filters** (tenant, date, category) with semantic search
- Reciprocal Rank Fusion for merging rankings
- Chunking strategy, metadata design, permissions per chunk
- Use SQL for **analytics questions** and vector search for **semantic questions** — route between them

## 7. Storing AI Application Data

```text
conversations(id, user_id, created_at)
messages(id, conversation_id, role, content, tokens, created_at)
tool_calls(id, message_id, tool_name, arguments JSONB, result JSONB)
embeddings / documents / chunks
eval_runs, feedback
```

## 8. Evaluation & Observability

- Execution accuracy: does the generated SQL return the expected result?
- Golden question set with expected SQL/results
- Log latency, tokens, retries, errors, unsafe-query blocks
- Track schema drift and update retrieval indexes

---

## ✅ Practice
1. Create a read-only role and verify writes fail.
2. Write a validator that rejects everything except a single `SELECT`.
3. Build a minimal Text-to-SQL script for the sample database.
4. Add pgvector and store embeddings for a few documents.
5. Build a hybrid query mixing metadata filter + vector similarity.
6. Create 20 golden questions and measure execution accuracy.

## 🧠 Self-check
- Why give the LLM views instead of raw tables?
- What are the risks of executing LLM-generated SQL?
- When is SQL better than vector search, and vice versa?

## 📓 Notebook
[class39.ipynb](./class39.ipynb)
