
# 🧠 Module 04 — Agent Memory and State

Learn how AI agents maintain context, track task progress, remember useful information, and preserve data across interactions.

## 📌 Module Information

| Field | Details |
|---|---|
| Course | AI Agents and Automation |
| Module | 04 — Agent Memory and State |
| Planned Date | Sep 5, 2026 |
| Level | Beginner to Advanced |
| Prerequisites | Modules 00–03: Setup, Agent Fundamentals, Architecture, and Tool Calling |
| Primary Language | Python |
| Tools | Python, Pydantic, JSON, SQLite, embeddings, vector databases |
| Main Focus | Context, state management, short-term memory, long-term memory, and retrieval |
| Next Module | 05 — Reasoning and Planning |

---

## 🎯 Learning Objectives

By completing this module, you will be able to:

- Explain the difference between context, state, and memory.
- Understand short-term and long-term memory.
- Store conversation history and task progress.
- Implement simple persistent memory in Python.
- Understand embeddings and vector-based retrieval.
- Decide what an agent should remember and when.
- Manage memory size, relevance, privacy, and expiration.
- Explain memory architecture in technical interviews.

---

## 1. Why Do AI Agents Need Memory?

An LLM does not automatically remember every previous interaction with a user. An application must provide relevant history or retrieve stored information when needed.

Consider this conversation:

**User:** My name is Ali, and I prefer Python examples.

**Later, user:** Show me an example of a class.

Without relevant context, the model may not know the user's name or preference. An application with memory can retrieve the preference and respond with a Python example.

Memory can also help an agent track a multi-step task, such as researching a topic, collecting results, and preparing a report.

However, **remembering information is not the same as reasoning correctly about it**. Memory supplies information; the agent still needs to interpret and use it appropriately.

## 2. Context vs. State vs. Memory

These terms are related, but each has a different purpose.

| Concept | Meaning | Example |
|---|---|---|
| Context | Information provided to the model for the current decision | Recent conversation messages |
| State | Information describing the current workflow or task | Current step, completed actions, tool results |
| Memory | Information retained for later use | A saved preference or previous task result |
| Conversation history | A record of previous messages | User and assistant messages |
| Persistent storage | Data saved beyond the current process | SQLite database or another database |

### Example

An agent is preparing a report about electric vehicles.

- **Context:** The latest user request and relevant research excerpts.
- **State:** Research completed; writing the report is the next step.
- **Memory:** A saved preference that the user wants concise technical reports.
- **Persistent storage:** A database containing saved preferences and task records.

State and memory may share the same storage system, but they represent different logical responsibilities.

---

## 3. Types of Agent Memory

### 3.1 Short-Term Memory

Short-term memory supports the current conversation or task.

Examples:

- Recent messages.
- Current user request.
- Tool results from the last few steps.
- Intermediate calculations.
- Current task status.

It is commonly implemented using variables, message history, state objects, or workflow checkpoints.

**Limitation:** keeping every message indefinitely can increase token usage and introduce irrelevant information.

### 3.2 Long-Term Memory

Long-term memory preserves selected information across conversations or tasks.

Examples:

- User preferences.
- Reusable project information.
- Previously completed tasks.
- Relevant facts the user has asked to retain.

It can be stored in a relational database, document store, or another persistent storage system.

Long-term memory should not automatically store everything. Applications should define what can be saved, how long it remains available, and how users can inspect or delete it.

### 3.3 Episodic Memory

Episodic memory stores information about particular past events or interactions.

Example:

> On September 5, the agent completed a product comparison and recorded the final shortlist.

A system might store the event, its timestamp, the outcome, and a reference to the supporting data.

### 3.4 Semantic Memory

Semantic memory stores facts or knowledge that can be reused across different tasks.

Example:

> The project uses Python, FastAPI, and PostgreSQL.

A semantic memory system may store structured facts or searchable documents.

### 3.5 Working Memory

Working memory holds the information needed while solving a task.

Example:

```python
working_memory = {
    "goal": "Prepare a product comparison",
    "products_found": 3,
    "next_step": "Compare prices",
    "completed": False,
}
```

Working memory is often represented through the agent's current state and context.

### 3.6 Vector Memory

Vector memory uses numerical representations called **embeddings** to retrieve semantically related content.

For example, a stored document says:

> The application uses PostgreSQL for its main database.

A query such as:

> Which database does the project use?

may retrieve the document because their meanings are related, even though the wording differs.

Vector retrieval is useful for semantic search, but it does not guarantee factual accuracy. Retrieved information still needs to be checked for relevance, freshness, and reliability.

---

## 4. Memory Architecture

```text
                User Request
                     |
                     v
              Current Context
                     |
                     v
              Agent Decision
                     |
           +---------+---------+
           |                   |
           v                   v
     Read Memory           Use Tools
           |                   |
           v                   v
    Relevant Results       Observations
           |                   |
           +---------+---------+
                     |
                     v
                Updated State
                     |
                     v
           Select Useful Memories
                     |
                     v
             Persistent Storage
```

A production system does not necessarily save every observation. It should select information that is useful, permitted, and appropriate to retain.

---

## 5. Implement Short-Term Memory in Python

Create `short_term_memory.py`:

```python
from dataclasses import dataclass, field


@dataclass
class ConversationMemory:
    max_messages: int = 6
    messages: list[dict[str, str]] = field(
        default_factory=list
    )

    def add_message(
        self,
        role: str,
        content: str,
    ) -> None:
        if role not in {"user", "assistant"}:
            raise ValueError("Unsupported message role")

        if not content.strip():
            raise ValueError("Message cannot be empty")

        self.messages.append({
            "role": role,
            "content": content,
        })

        # Keep only the most recent messages.
        self.messages = self.messages[-self.max_messages:]

    def get_messages(self) -> list[dict[str, str]]:
        return self.messages.copy()


if __name__ == "__main__":
    memory = ConversationMemory(max_messages=4)

    memory.add_message("user", "I am learning Python.")
    memory.add_message(
        "assistant",
        "Great! We can practise with small examples.",
    )
    memory.add_message("user", "Explain classes.")
    memory.add_message(
        "assistant",
        "A class defines the structure and behaviour of objects.",
    )
    memory.add_message("user", "Show me an example.")

    for message in memory.get_messages():
        print(f"{message['role']}: {message['content']}")
```

### What does this example demonstrate?

- Messages are stored in chronological order.
- The message limit prevents unbounded growth.
- Older messages are removed when the limit is exceeded.
- `get_messages()` returns a copy of the list.

**Important:** limiting the number of messages is a simple demonstration, not a complete context-management strategy. In production, preserve essential instructions and task facts, and consider token budgets, summarization, and relevance. Do not blindly discard information required for correctness.

---

## 6. Implement Persistent Memory with SQLite

Variables disappear when a Python process ends. Persistent storage allows selected information to survive restarts.

SQLite is useful for learning because it is built into Python and does not require a separate database server.

Create `persistent_memory.py`:

```python
import sqlite3
from pathlib import Path


DB_PATH = Path("agent_memory.db")


def initialize_database() -> None:
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)


def save_memory(category: str, content: str) -> None:
    if not category.strip() or not content.strip():
        raise ValueError("Category and content are required")

    with sqlite3.connect(DB_PATH) as connection:
        connection.execute(
            """
            INSERT INTO memories (category, content)
            VALUES (?, ?)
            """,
            (category, content),
        )


def search_memories(keyword: str) -> list[tuple]:
    pattern = f"%{keyword}%"

    with sqlite3.connect(DB_PATH) as connection:
        cursor = connection.execute(
            """
            SELECT id, category, content, created_at
            FROM memories
            WHERE content LIKE ?
            ORDER BY id DESC
            LIMIT 20
            """,
            (pattern,),
        )
        return cursor.fetchall()


if __name__ == "__main__":
    initialize_database()

    save_memory(
        "project",
        "The project uses Python and PostgreSQL.",
    )

    for memory in search_memories("PostgreSQL"):
        print(memory)
```

Run:

```bash
python persistent_memory.py
```

This creates an `agent_memory.db` file in the working directory.

### What did you learn?

- `initialize_database()` creates the table.
- `save_memory()` stores a memory persistently.
- `search_memories()` retrieves matching records.
- Parameterized SQL helps prevent SQL injection.
- The database remains available after the script exits.

This is a basic keyword-search implementation, not a vector database. For a real application, add user or tenant ownership, access controls, update and deletion operations, retention rules, and tests.

---

## 7. Embeddings and Vector Retrieval

An embedding model converts text into a vector of numbers.

```text
Text
 |
 v
Embedding Model
 |
 v
[0.12, -0.43, 0.78, ...]
 |
 v
Vector Index
 |
 v
Similarity Search
 |
 v
Relevant Documents
```

The actual vector dimension depends on the embedding model.

### How retrieval works

1. Store a document.
2. Generate an embedding for the document.
3. Store the embedding alongside a document reference.
4. Convert the user's query into an embedding.
5. Search for similar vectors.
6. Retrieve the corresponding documents.
7. Provide relevant results to the agent.

Similarity may be calculated using cosine similarity, dot product, or another supported metric.

### Keyword search vs. vector search

| Feature | Keyword Search | Vector Search |
|---|---|---|
| Matching | Text terms and patterns | Semantic similarity |
| Example | Finds exact occurrences of `PostgreSQL` | May match “Which database does the project use?” |
| Strength | Simple and transparent | Useful for meaning-based retrieval |
| Limitation | Can miss differently worded queries | Can retrieve related but incorrect content |
| Typical use | Structured records and exact terms | Semantic document retrieval |

Hybrid retrieval combines keyword and semantic methods. It can be helpful when exact identifiers and conceptual similarity both matter.

### Important distinction

**Vector memory is not automatically a complete memory system.**

A vector database is a retrieval mechanism. A memory system also needs decisions about what to store, ownership, timestamps, updates, deletion, access permissions, and how retrieved information is used.

---

## 8. Memory Management Best Practices

| Challenge | Recommended Approach |
|---|---|
| Too much conversation history | Use token-aware trimming or summarization |
| Irrelevant retrieved content | Apply relevance thresholds and reranking where appropriate |
| Outdated facts | Store timestamps and update or expire stale entries |
| Duplicate memories | Deduplicate or merge records |
| Conflicting information | Track source and recency; do not silently assume every newer statement is correct |
| Sensitive information | Minimize collection and enforce access controls |
| Incorrect stored facts | Support correction and deletion |
| Cross-user data exposure | Scope memory queries to the authorized user or tenant |
| Poor retrieval | Evaluate retrieval quality with representative queries |
| Prompt injection in stored documents | Treat retrieved text as untrusted data, not as privileged instructions |

Do not save secrets, passwords, API keys, or sensitive personal information as general-purpose memory.

---

## 9. Hands-On Exercises

### Beginner

- [ ] Build a conversation memory that stores five messages.
- [ ] Add a method to clear the memory.
- [ ] Track the number of messages stored.
- [ ] Test empty messages and unsupported roles.

### Intermediate

- [ ] Extend the SQLite example with a `delete_memory()` function.
- [ ] Add a category filter.
- [ ] Add a timestamp and a retention policy.
- [ ] Write unit tests for saving, searching, and deleting records.

### Advanced

- [ ] Generate embeddings for a small collection of documents.
- [ ] Implement semantic retrieval using a supported embedding model and vector index.
- [ ] Compare keyword search with vector retrieval using the same test queries.
- [ ] Add metadata filters so users retrieve only their own records.
- [ ] Measure retrieval precision and inspect irrelevant results.
- [ ] Build a small agent that uses retrieved memory to answer a question and identifies when the evidence is insufficient.

---

## 10. Interview Questions and Answers

**Q1. What is memory in an AI agent?**

Memory is information retained and retrieved to help an agent perform current or future tasks.

**Q2. What is the difference between state and memory?**

State tracks the current workflow's progress. Memory preserves selected information for later use.

**Q3. What is short-term memory?**

Information maintained for the current conversation or task, such as recent messages and intermediate results.

**Q4. What is long-term memory?**

Information retained across tasks or sessions, often using persistent storage.

**Q5. What are embeddings?**

Embeddings are numerical representations of data that can help systems retrieve semantically similar content.

**Q6. Why use a vector database?**

It provides indexing and retrieval capabilities for similarity searches over vector representations, often with metadata filtering.

**Q7. Does a vector database guarantee accurate answers?**

No. Retrieval can return irrelevant or misleading documents. Results must be evaluated and interpreted appropriately.

**Q8. How can an agent control context size?**

It can trim history, summarize previous interactions, retrieve relevant memories, and enforce token budgets while preserving essential information.

**Q9. What is episodic memory?**

It stores information about particular past events, tasks, or interactions.

**Q10. How should an application protect memory?**

Use data minimization, access controls, user or tenant isolation, retention policies, and appropriate update and deletion mechanisms.

---

## 11. Completion Checklist

- [ ] I can explain context, state, and memory.
- [ ] I understand short-term, long-term, episodic, and semantic memory.
- [ ] I implemented conversation memory in Python.
- [ ] I stored and retrieved persistent records using SQLite.
- [ ] I understand the purpose of embeddings.
- [ ] I can explain keyword search versus vector search.
- [ ] I understand memory limits, privacy, and access controls.
- [ ] I completed at least three exercises.

---

## 🔑 Key Takeaways

- Context is what the model receives for its current decision.
- State tracks task progress and workflow data.
- Memory retains selected information for reuse.
- Short-term memory helps manage current interactions.
- Persistent storage preserves information across process restarts.
- Embeddings support semantic retrieval but do not guarantee correctness.
- Memory requires deliberate decisions about relevance, freshness, privacy, and deletion.

## 🚀 Next Module — Reasoning and Planning

In Module 05, you will learn how agents break down tasks, select actions, plan multi-step execution, evaluate observations, and decide when to continue or stop.

**Suggested commit message:**

```text
Sep 5, 2026 — Day 5: Agent memory — short-term, long-term, and vector memory
```
