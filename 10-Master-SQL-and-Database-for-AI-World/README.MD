# 🗄️ SQL — Beginner to Advanced

> **SQL, Database Engineering, Design, Performance & Architecture**

A complete **SQL and Database Engineering learning path** covering everything from basic SQL queries to relational database design, transactions, concurrency, indexing, performance optimization, database architecture, Python integration, and SQL for AI Engineering.

This folder is designed as a **standalone SQL / Database Engineering section** of my overall learning journey.

---

## 📌 About This Folder

This folder is not only about learning how to write SQL queries.

The goal is to understand:

- How relational databases work
- How data is modeled
- How tables and relationships are designed
- How SQL queries retrieve and modify data
- How complex queries are written
- How transactions maintain data consistency
- How concurrency works
- How indexes improve performance
- How query execution plans work
- How databases are secured
- How production databases are designed
- How databases scale
- How SQL integrates with Python and backend applications
- How databases are used in AI, LLM, RAG and agentic systems

The learning path gradually moves from:

```text
SQL Basics
    ↓
Querying
    ↓
Advanced SQL
    ↓
Transactions & Concurrency
    ↓
Indexes & Performance
    ↓
Database Design
    ↓
Advanced Database Features
    ↓
Database Architecture
    ↓
Python / Backend Integration
    ↓
SQL for AI Engineering
````

---

# 🎯 Main Goal

The goal of this folder is to build strong SQL knowledge and gradually develop **Database Engineering and Database Architecture thinking**.

By completing this section, I should be able to:

* Write clean and complex SQL queries
* Understand relational database concepts
* Design normalized relational schemas
* Use primary keys, foreign keys and constraints correctly
* Work with joins, subqueries and CTEs
* Use advanced SQL features
* Understand transactions and ACID
* Understand concurrency and MVCC
* Design and use indexes
* Read basic query execution plans
* Optimize slow queries
* Design databases for real applications
* Understand database security
* Understand replication, partitioning and scaling
* Connect SQL databases with Python and FastAPI
* Understand SQL usage in AI applications
* Build safe Text-to-SQL and database-powered AI systems

---

# 🧠 Learning Philosophy

The learning process follows the lifecycle of a real database system:

```text
Understand Data
      ↓
Model Data
      ↓
Create Tables
      ↓
Query Data
      ↓
Combine Data
      ↓
Aggregate Data
      ↓
Modify Data Safely
      ↓
Control Transactions
      ↓
Handle Concurrency
      ↓
Optimize Queries
      ↓
Design Reliable Schemas
      ↓
Secure the Database
      ↓
Scale the Database
      ↓
Connect Applications
      ↓
Build AI Systems
```

The focus is not only:

> "How do I write this SQL query?"

It is also:

> "Why does this query work, how does the database execute it, and how should this database be designed for a real application?"

---

# 🐘 Primary Database — PostgreSQL

**PostgreSQL** is the primary database used throughout this learning path.

It provides a strong environment for learning both standard SQL and advanced database engineering concepts.

Topics covered with PostgreSQL include:

* Standard SQL
* Transactions
* Constraints
* Foreign keys
* CTEs
* Window functions
* JSON / JSONB
* Arrays
* Full-text search
* Advanced indexes
* Query planning
* EXPLAIN / EXPLAIN ANALYZE
* Functions
* Procedures
* Triggers
* Views
* Materialized views
* Row-Level Security
* Partitioning
* Replication concepts
* Extensions
* pgvector

The goal is to understand **general relational database concepts** while using PostgreSQL for practical implementation.

---

# 📂 Folder Structure

```text
10-SQL-Beginner-to-Advanced/
│
├── README.md
│
├── 00-Setup-and-Datasets/
│   ├── README.md
│   ├── schema.sql
│   └── seed.sql
│
├── 01-SQL-Introduction/
│   ├── README.md
│   └── class26.ipynb
│
├── 02-Database-Fundamentals/
│   ├── README.md
│   └── class27.ipynb
│
├── 03-SELECT-and-Filtering/
│   ├── README.md
│   └── class28.ipynb
│
├── 04-Aggregations-and-GROUP-BY/
│   ├── README.md
│   └── class29.ipynb
│
├── 05-JOINs/
│   ├── README.md
│   └── class30.ipynb
│
├── 06-Subqueries-and-CTEs/
│   ├── README.md
│   └── class31.ipynb
│
├── 07-Advanced-SQL/
│   ├── README.md
│   └── class32.ipynb
│
├── 08-Transactions-and-Concurrency/
│   ├── README.md
│   └── class33.ipynb
│
├── 09-Indexes-and-Performance/
│   ├── README.md
│   └── class34.ipynb
│
├── 10-Database-Design/
│   ├── README.md
│   └── class35.ipynb
│
├── 11-Advanced-Database/
│   ├── README.md
│   └── class36.ipynb
│
├── 12-Database-Architecture/
│   ├── README.md
│   └── class37.ipynb
│
├── 13-SQL-Python/
│   ├── README.md
│   └── class38.ipynb
│
└── 14-SQL-for-AI-Engineering/
    ├── README.md
    └── class39.ipynb
```

Each major topic has its own folder.

Each folder contains:

* `README.md` → concepts and learning notes
* Notebook / SQL files → practical implementation
* Additional SQL files where required

This keeps the SQL curriculum organized and easy to navigate.

---

# 🗺️ Complete Roadmap

| #  | Folder                       | Main Focus                                 | Level |
| -- | ---------------------------- | ------------------------------------------ | ----- |
| 00 | Setup and Datasets           | Environment and practice database          | 🟢    |
| 01 | SQL Introduction             | SQL fundamentals                           | 🟢    |
| 02 | Database Fundamentals        | Tables, keys, constraints                  | 🟢    |
| 03 | SELECT and Filtering         | Querying and filtering                     | 🟢    |
| 04 | Aggregations and GROUP BY    | Analysis and aggregation                   | 🟢    |
| 05 | JOINs                        | Combining relational data                  | 🔵    |
| 06 | Subqueries and CTEs          | Complex queries                            | 🔵    |
| 07 | Advanced SQL                 | Window functions, JSONB, advanced features | 🟣    |
| 08 | Transactions and Concurrency | ACID, locks, MVCC                          | 🟣    |
| 09 | Indexes and Performance      | Query optimization                         | 🟣    |
| 10 | Database Design              | Data modeling and normalization            | 🔴    |
| 11 | Advanced Database            | Views, triggers, security                  | 🔴    |
| 12 | Database Architecture        | Scaling and reliability                    | 🔴    |
| 13 | SQL + Python                 | Application integration                    | 🔴    |
| 14 | SQL for AI Engineering       | Text-to-SQL, RAG, AI systems               | 🔴    |

---

# 📚 Module Breakdown

## 00 — Setup and Datasets

This folder prepares the development environment.

### Covers

* PostgreSQL installation
* PostgreSQL with Docker
* `psql`
* pgAdmin
* DBeaver
* VS Code database tools
* Database connections
* Creating databases
* Creating schemas
* Loading SQL files
* Sample datasets
* Schema setup
* Seed data

### Main purpose

Create a consistent database environment for practicing all upcoming SQL topics.

---

# 01 — SQL Introduction

Introduces SQL and relational databases.

### Covers

* What is SQL?
* Why SQL is used
* Declarative programming
* SQL vs programming languages
* DBMS
* RDBMS
* Relational databases
* SQL dialects
* PostgreSQL
* MySQL
* SQL Server
* Oracle
* SQL command categories

### SQL command categories

```text
DDL → Data Definition Language
DML → Data Manipulation Language
DQL → Data Query Language
DCL → Data Control Language
TCL → Transaction Control Language
```

---

# 02 — Database Fundamentals

Builds the foundation of relational database systems.

### Covers

* Database
* Schema
* Table
* Row
* Column
* Data types
* Primary keys
* Foreign keys
* Candidate keys
* Composite keys
* Natural keys
* Surrogate keys
* Constraints
* Relationships
* Referential integrity
* DDL

### Main SQL commands

```sql
CREATE
ALTER
DROP
TRUNCATE
```

Also introduces PostgreSQL system catalogs and `information_schema`.

---

# 03 — SELECT and Filtering

Focuses on retrieving and filtering data.

### Covers

* SELECT
* DISTINCT
* Column aliases
* WHERE
* Comparison operators
* Logical operators
* IN
* BETWEEN
* LIKE
* ILIKE
* ORDER BY
* LIMIT
* OFFSET
* NULL
* COALESCE
* NULLIF
* String functions
* Numeric functions
* Date/time functions

Also introduces:

* SQL logical query processing order
* NULL and three-valued logic
* Pagination concepts
* Keyset/cursor pagination

---

# 04 — Aggregations and GROUP BY

Focuses on analyzing relational data.

### Covers

* COUNT
* SUM
* AVG
* MIN
* MAX
* GROUP BY
* HAVING
* CASE
* Conditional aggregation
* `FILTER`
* Multiple grouping columns
* Date-based aggregation
* `DATE_TRUNC`

Important concepts include:

```text
COUNT(*)
COUNT(column)
COUNT(DISTINCT column)
```

and understanding how NULL values affect aggregation.

---

# 05 — JOINs

One of the most important SQL topics.

### Covers

* INNER JOIN
* LEFT JOIN
* RIGHT JOIN
* FULL JOIN
* CROSS JOIN
* SELF JOIN
* Multiple-table joins
* Join conditions
* Join cardinality
* Anti-joins
* Semi-joins
* Duplicate rows
* NULL join behavior
* Join explosion
* `ON` vs `WHERE`

A major focus is understanding the **grain of the result**.

---

# 06 — Subqueries and CTEs

Focuses on building more complex queries.

### Covers

* Scalar subqueries
* Multi-row subqueries
* Derived tables
* Correlated subqueries
* `IN`
* `EXISTS`
* `NOT EXISTS`
* `ANY`
* `ALL`
* `NOT IN` and NULL behavior
* Common Table Expressions
* Recursive CTEs
* UNION
* UNION ALL
* INTERSECT
* EXCEPT

The goal is to understand when to use:

```text
JOIN
Subquery
EXISTS
CTE
Window Function
```

---

# 07 — Advanced SQL

Moves into advanced PostgreSQL SQL capabilities.

### Covers

### Window Functions

* ROW_NUMBER
* RANK
* DENSE_RANK
* NTILE
* LAG
* LEAD
* FIRST_VALUE
* LAST_VALUE
* Window frames

Practical use cases:

* Running totals
* Rankings
* Top-N per group
* Previous/next records
* Moving calculations

### Other Advanced Topics

* Recursive CTEs
* GROUPING SETS
* ROLLUP
* CUBE
* LATERAL
* JSON
* JSONB
* Arrays
* `UNNEST`
* Full-text search
* `generate_series`

---

# 08 — Transactions and Concurrency

Introduces safe database modifications and multi-user behavior.

### CRUD

* INSERT
* UPDATE
* DELETE
* UPSERT
* `ON CONFLICT`
* `RETURNING`

### Transactions

* BEGIN
* COMMIT
* ROLLBACK
* SAVEPOINT
* ACID

### Concurrency

* Isolation levels
* Dirty reads
* Non-repeatable reads
* Phantom reads
* Serialization problems
* MVCC
* Row locks
* Table locks
* Advisory locks
* Deadlocks
* `SKIP LOCKED`

Also introduces:

* Optimistic concurrency
* Pessimistic concurrency
* Safe transaction design

---

# 09 — Indexes and Performance

Focuses on understanding why queries become slow and how to optimize them.

### Covers

* Why indexes exist
* B-tree indexes
* Hash indexes
* GIN
* GiST
* SP-GiST
* BRIN
* Composite indexes
* Partial indexes
* Expression indexes
* Covering indexes
* `INCLUDE`

### Query Performance

* EXPLAIN
* EXPLAIN ANALYZE
* Query plans
* Sequential scans
* Index scans
* Bitmap scans
* Join strategies
* Sort operations
* Aggregate operations
* Planner statistics
* ANALYZE
* VACUUM
* Index maintenance

### Performance workflow

```text
Slow Query
    ↓
Measure
    ↓
EXPLAIN ANALYZE
    ↓
Understand Query Plan
    ↓
Find Bottleneck
    ↓
Check Query
    ↓
Check Indexes
    ↓
Check Joins
    ↓
Check Data Distribution
    ↓
Optimize
    ↓
Measure Again
```

The goal is to optimize based on evidence rather than blindly adding indexes.

---

# 10 — Database Design

Focuses on designing reliable relational databases.

### Covers

* Requirements analysis
* Entities
* Attributes
* Relationships
* ER modeling
* Primary keys
* Foreign keys
* Composite keys
* Constraints
* Referential actions
* Normalization
* 1NF
* 2NF
* 3NF
* BCNF
* 4NF
* 5NF
* Denormalization

### Practical Design Topics

* Junction tables
* Audit columns
* Soft deletes
* Multi-tenancy
* ID strategies
* Identity columns
* UUIDs
* UUIDv7 concepts
* ULID concepts
* Data lifecycle
* Query-driven design
* Common schema anti-patterns

The focus is not only creating tables, but designing databases that remain maintainable as applications grow.

---

# 11 — Advanced Database

Covers important database features used in real applications.

### Covers

* Views
* Materialized views
* Functions
* Procedures
* Triggers
* Sequences
* Identity columns
* Schemas
* Temporary tables

### Security

* Database users
* Roles
* Permissions
* GRANT
* REVOKE
* Row-Level Security
* SQL injection
* Parameterized queries
* Database boundaries
* Auditing
* Encryption concepts

The goal is to understand how databases provide both application functionality and security controls.

---

# 12 — Database Architecture

Moves from individual queries and schemas into complete database systems.

### Covers

### Database Workloads

* OLTP
* OLAP
* Data warehouses
* Fact tables
* Dimension tables
* Star schema
* Snowflake schema

### Data Engineering Concepts

* ETL
* ELT
* Data lakes
* Lakehouses
* Slowly Changing Dimensions

### Scaling

* Partitioning
* Replication
* Read replicas
* Connection pooling
* Caching
* Sharding
* Horizontal scaling
* Vertical scaling

### Reliability

* High availability
* Failover
* Backups
* Point-in-time recovery
* RPO
* RTO
* Disaster recovery
* Monitoring

### Distributed Systems

* CAP theorem
* Consistency models
* CQRS
* Event sourcing
* Polyglot persistence

The focus is understanding **why different database architectures are used for different workloads**.

---

# 13 — SQL + Python

Connects SQL with application development.

### Covers

* PostgreSQL with Python
* `psycopg`
* Pandas + SQL
* `read_sql`
* `to_sql`
* SQLAlchemy
* SQLAlchemy Core
* SQLAlchemy ORM
* Alembic
* Database migrations
* Connection pooling
* Parameterized queries

### Backend Integration

* FastAPI + PostgreSQL
* Transaction handling
* Repository patterns
* Service-layer concepts
* Raw SQL vs ORM
* N+1 query problem
* Database error handling

The goal is to understand how databases are actually used inside backend applications.

---

# 14 — SQL for AI Engineering

Connects database engineering with modern AI systems.

### Covers

### Text-to-SQL

```text
User Question
      ↓
Understand Intent
      ↓
Retrieve Database Schema
      ↓
Generate SQL
      ↓
Validate SQL
      ↓
Execute Safely
      ↓
Return Result
```

### AI + Database Topics

* Text-to-SQL
* Schema retrieval
* LLM SQL generation
* SQL validation
* SQL agents
* Database tools
* Read-only database roles
* Query allowlists
* Query timeouts
* Row-Level Security
* Audit logging

### PostgreSQL + AI

* pgvector
* Embeddings
* Vector search
* HNSW
* IVFFlat
* Metadata filtering
* Hybrid search
* RAG with PostgreSQL

### Important Principle

AI-generated SQL should **not blindly receive unrestricted database access**.

Safe AI database systems should consider:

```text
Permissions
+
Validation
+
Read/Write Boundaries
+
Query Limits
+
Timeouts
+
RLS
+
Audit Logs
```

---

# 🗃️ Practice Database

A shared PostgreSQL practice database is used throughout the curriculum.

Example structure:

```text
departments
     │
     └──< employees
             │
             └── employees
                (manager hierarchy)


customers
     │
     └──< orders
             │
             └──< order_items >── products
                                  │
                                  └── categories
```

The dataset intentionally contains realistic edge cases such as:

* NULL values
* Customers without orders
* Products without sales
* Employees without departments
* Employee manager hierarchies
* Multiple managers
* Pending orders
* Cancelled orders
* Multiple dates
* Composite primary keys
* Foreign keys
* UNIQUE constraints
* CHECK constraints

This allows the same database to be reused while learning:

* SELECT
* Filtering
* Aggregation
* JOINs
* NULL handling
* Subqueries
* CTEs
* Recursive queries
* Constraints
* Transactions
* Indexes
* Database design

---

# 🏗️ Database Engineering Mindset

Database engineering is more than writing queries.

When designing a database, important questions include:

```text
What data do we store?
        ↓
What are the entities?
        ↓
How are entities related?
        ↓
What are the keys?
        ↓
What constraints are required?
        ↓
How should the data be normalized?
        ↓
What queries will the application run?
        ↓
Which indexes support those queries?
        ↓
How much data will exist?
        ↓
How many users will access it?
        ↓
What are the transaction requirements?
        ↓
What security rules are required?
        ↓
How will backups and recovery work?
        ↓
How will the system scale?
```

---

# ⚡ Performance Mindset

A slow query should not automatically lead to:

> "Add an index."

Instead:

```text
Measure
→ Understand
→ Identify Bottleneck
→ Optimize
→ Measure Again
```

Performance depends on multiple factors:

* Query structure
* Data size
* Data distribution
* Indexes
* Joins
* Sorting
* Aggregations
* Statistics
* Memory
* Disk I/O
* Concurrency
* Database configuration

---

# 🔐 Production Database Mindset

A production database must consider:

```text
Correctness
+
Consistency
+
Security
+
Performance
+
Scalability
+
Reliability
+
Observability
+
Maintainability
```

A database can return the correct result and still be poorly designed if it:

* Becomes slow at scale
* Allows invalid data
* Has weak security
* Cannot recover from failure
* Creates excessive locking
* Has poor backup/recovery
* Is difficult to maintain

---

# 🔄 SQL Learning Workflow

For every topic, the learning process follows:

```text
1. Understand the Concept
        ↓
2. Learn the Syntax
        ↓
3. See a Simple Example
        ↓
4. Practice on the Sample Database
        ↓
5. Solve Different Cases
        ↓
6. Understand Common Mistakes
        ↓
7. Understand Performance / Design Implications
        ↓
8. Apply It to Real Applications
```

The goal is to move from:

```text
Syntax
→ Understanding
→ Practice
→ Problem Solving
→ Engineering
```

---

# 🛠️ Tools

Primary tools used throughout this section:

| Tool       | Purpose                         |
| ---------- | ------------------------------- |
| PostgreSQL | Primary relational database     |
| Docker     | Database environment            |
| psql       | PostgreSQL CLI                  |
| pgAdmin    | Database administration         |
| DBeaver    | Database GUI                    |
| VS Code    | Development environment         |
| Jupyter    | Interactive SQL/Python learning |
| Python     | Application integration         |
| Pandas     | Data analysis                   |
| SQLAlchemy | Python database toolkit         |
| FastAPI    | Backend integration             |
| Git        | Version control                 |

---

# 📖 SQL Skill Levels

### 🟢 Beginner

```text
01 → SQL Introduction
02 → Database Fundamentals
03 → SELECT and Filtering
04 → Aggregations and GROUP BY
```

Focus:

* SQL syntax
* Relational concepts
* Basic querying
* Filtering
* Aggregation
* Constraints

---

### 🔵 Intermediate

```text
05 → JOINs
06 → Subqueries and CTEs
```

Focus:

* Multi-table queries
* Complex filtering
* Query composition
* Relational reasoning

---

### 🟣 Advanced

```text
07 → Advanced SQL
08 → Transactions and Concurrency
09 → Indexes and Performance
```

Focus:

* Advanced querying
* Window functions
* Transactions
* Concurrency
* MVCC
* Locks
* Query plans
* Performance

---

### 🔴 Database Engineering

```text
10 → Database Design
11 → Advanced Database
12 → Database Architecture
13 → SQL + Python
14 → SQL for AI Engineering
```

Focus:

* Production database design
* Security
* Architecture
* Scaling
* Reliability
* Backend integration
* AI systems

---

# 🔗 SQL in the Bigger Engineering Stack

SQL connects to many areas of software engineering:

```text
                    SQL
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   Backend       Data Science   Analytics
        │
        ↓
  Application DB
        │
        ├── APIs
        ├── FastAPI
        ├── Next.js
        ├── Mobile Apps
        └── Enterprise Systems
                     │
                     ↓
               AI Engineering
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       RAG       Text-to-SQL   Agents
          │          │          │
          └──────────┼──────────┘
                     ↓
                PostgreSQL
```

SQL therefore becomes an important foundation for:

* Backend Development
* Data Engineering
* Data Science
* Analytics
* AI Engineering
* RAG Systems
* LLM Applications
* Enterprise Applications
* Database Engineering

---

# 📈 Progress Tracker

| Module | Topic                        | Status |
| ------ | ---------------------------- | ------ |
| 00     | Setup and Datasets           | ⬜      |
| 01     | SQL Introduction             | ⬜      |
| 02     | Database Fundamentals        | ⬜      |
| 03     | SELECT and Filtering         | ⬜      |
| 04     | Aggregations and GROUP BY    | ⬜      |
| 05     | JOINs                        | ⬜      |
| 06     | Subqueries and CTEs          | ⬜      |
| 07     | Advanced SQL                 | ⬜      |
| 08     | Transactions and Concurrency | ⬜      |
| 09     | Indexes and Performance      | ⬜      |
| 10     | Database Design              | ⬜      |
| 11     | Advanced Database            | ⬜      |
| 12     | Database Architecture        | ⬜      |
| 13     | SQL + Python                 | ⬜      |
| 14     | SQL for AI Engineering       | ⬜      |

---

# ✅ Final Learning Outcome

After completing this SQL section, the goal is to be able to think beyond individual queries.

I should be able to understand the complete database lifecycle:

```text
Requirements
    ↓
Data Modeling
    ↓
Schema Design
    ↓
SQL Queries
    ↓
Data Integrity
    ↓
Transactions
    ↓
Concurrency
    ↓
Indexes
    ↓
Query Optimization
    ↓
Security
    ↓
Application Integration
    ↓
Scaling & Reliability
    ↓
AI Integration
```

The final objective is to develop the ability to:

> **Design relational databases, write complex SQL, maintain data integrity, understand transactions and concurrency, optimize database performance, integrate databases with applications, and reason about database architecture and AI-powered database systems.**

---

# 👨‍💻 **Developer**

**Waleed Khokhar**

***Full-Stack AI Engineer***

Full-Stack AI Engineer with 1+ year of hands-on experience building production-ready applications across the complete AI stack — from **Data Science, Machine Learning, and Deep Learning** to **Generative AI, LLMs, RAG pipelines, and Agentic AI systems**. Experienced in building intelligent solutions that combine **AI, modern web and mobile development, cloud, and DevOps**, with a focus on creating **scalable, reliable, and production-ready applications** from development to deployment.

## 🌐 Connect With Me

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge\&logo=vercel\&logoColor=white)](https://waledkhokar.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge\&logo=linkedin\&logoColor=white)](https://linkedin.com/in/waleedkhokhar)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/waleedkhokar)

</div>
