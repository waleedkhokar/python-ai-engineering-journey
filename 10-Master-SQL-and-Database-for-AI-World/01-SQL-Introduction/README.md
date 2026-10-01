# 01 — SQL Introduction

## 🎯 Goals
- Understand what SQL is and where it is used
- Know the difference between DBMS and RDBMS
- Know the categories of SQL commands
- Run your first queries

## 📚 Topics
1. What is SQL?
2. SQL is declarative
3. DBMS vs RDBMS
4. Popular databases
5. SQL command categories (DDL, DML, DQL, DCL, TCL)
6. SQL execution basics
7. SQL standards and dialects

---

## 1. What is SQL?

**Structured Query Language** — the standard language for interacting with relational databases.

```sql
SELECT * FROM employees;
```

> "Give me all records from the employees table."

## 2. SQL is Declarative

You describe **what** you want; the database engine decides **how** to get it.

```sql
SELECT first_name FROM employees WHERE salary >= 100000;
```

## 3. DBMS vs RDBMS

| DBMS | RDBMS |
|------|-------|
| Software to store and manage data | DBMS that stores data in related tables |
| May use files, documents, graphs | Uses tables, rows, columns, keys |
| Examples: MongoDB, Redis | Examples: PostgreSQL, MySQL, SQL Server, Oracle, SQLite |

## 4. Popular Relational Databases

| Database | Notes |
|----------|-------|
| PostgreSQL | Feature-rich, open source — **used in this course** |
| MySQL / MariaDB | Popular for web applications |
| SQL Server | Microsoft enterprise database |
| Oracle | Enterprise database |
| SQLite | Embedded, file-based |

## 5. SQL Command Categories

| Category | Purpose | Commands |
|----------|---------|----------|
| **DDL** | Define structure | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Modify data | `INSERT`, `UPDATE`, `DELETE` |
| **DQL** | Query data | `SELECT` |
| **DCL** | Control access | `GRANT`, `REVOKE` |
| **TCL** | Control transactions | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

## 6. How a Query Runs (Preview)

```text
SQL Query → Parser → Analyzer → Planner/Optimizer → Executor → Storage → Result
```

Covered in depth in [09-Indexes-and-Performance](../09-Indexes-and-Performance).

## 7. Dialects

SQL is standardized (ANSI/ISO) but each database adds extensions:

| Feature | PostgreSQL | MySQL | SQL Server |
|---------|-----------|-------|------------|
| Limit rows | `LIMIT 10` | `LIMIT 10` | `TOP 10` / `FETCH` |
| String concat | `\|\|` / `CONCAT` | `CONCAT` | `+` / `CONCAT` |
| Case-insensitive match | `ILIKE` | `LIKE` (collation) | `LIKE` (collation) |

---

## ✅ Practice
1. Connect to `sql_lab` with `psql`.
2. Run `SELECT version();`
3. Run `SELECT * FROM departments;`
4. Classify each as DDL/DML/DQL/DCL/TCL: `CREATE TABLE`, `UPDATE`, `SELECT`, `GRANT`, `COMMIT`.

## 🧠 Self-check
- What does "declarative" mean?
- Is every DBMS an RDBMS?
- Which category does `TRUNCATE` belong to?

## 📓 Notebook
[class26.ipynb](./class26.ipynb)
