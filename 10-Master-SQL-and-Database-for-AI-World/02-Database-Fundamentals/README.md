# 02 — Database Fundamentals

## 🎯 Goals
- Understand the relational model
- Choose correct data types
- Create tables with constraints
- Use DDL to define and change structure

## 📚 Topics
1. Database, schema, table, row, column
2. Keys (primary, foreign, candidate, composite, natural, surrogate)
3. Data types
4. Constraints
5. `CREATE`, `ALTER`, `DROP`, `TRUNCATE`
6. Relationships (1:1, 1:N, M:N)

---

## 1. Relational Building Blocks

```text
users

id | name  | email
---|-------|-------------------
1  | Ali   | ali@example.com
2  | Ahmed | ahmed@example.com
```

| Term | Meaning |
|------|---------|
| Table | Collection of related data (`users`) |
| Row / Record / Tuple | One entry |
| Column / Field / Attribute | One property |
| Schema | Namespace grouping tables |

## 2. Keys

| Key | Description |
|-----|-------------|
| Primary key | Uniquely identifies a row; not null |
| Foreign key | References a primary key in another table |
| Candidate key | Any column set that could be the primary key |
| Composite key | Key made of multiple columns |
| Natural key | Real-world identifier (email, passport no.) |
| Surrogate key | Artificial identifier (serial, UUID) |

## 3. Data Types

| Group | PostgreSQL types |
|-------|------------------|
| Integer | `SMALLINT`, `INTEGER`, `BIGINT` |
| Exact decimal | `NUMERIC(p,s)`, `DECIMAL` |
| Floating | `REAL`, `DOUBLE PRECISION` |
| Text | `CHAR(n)`, `VARCHAR(n)`, `TEXT` |
| Boolean | `BOOLEAN` |
| Date/time | `DATE`, `TIME`, `TIMESTAMP`, `TIMESTAMPTZ`, `INTERVAL` |
| Other | `UUID`, `JSON`, `JSONB`, `ARRAY`, `ENUM`, `BYTEA` |

> ⚠️ Use `NUMERIC` for money — never `REAL`/`DOUBLE PRECISION`.

Why types matter: storage, validation, performance, indexing, precision, application behavior.

## 4. Constraints

```sql
CREATE TABLE users (
    id         BIGINT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) UNIQUE,
    age        INTEGER CHECK (age >= 0),
    status     VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

| Constraint | Purpose |
|------------|---------|
| `PRIMARY KEY` | Unique + not null identifier |
| `FOREIGN KEY` | Referential integrity |
| `UNIQUE` | No duplicates |
| `NOT NULL` | Value required |
| `CHECK` | Custom validation |
| `DEFAULT` | Value when omitted |

## 5. DDL

```sql
ALTER TABLE users ADD COLUMN phone VARCHAR(30);
ALTER TABLE users ALTER COLUMN phone TYPE TEXT;
ALTER TABLE users RENAME COLUMN phone TO mobile;
ALTER TABLE users DROP COLUMN mobile;

TRUNCATE TABLE users;   -- remove all rows, keep structure
DROP TABLE users;       -- remove table entirely
```

| Command | Removes | Structure kept |
|---------|---------|----------------|
| `DELETE` | Selected rows | ✅ |
| `TRUNCATE` | All rows | ✅ |
| `DROP` | Whole table | ❌ |

## 6. Relationships

```text
1:1   user ── profile
1:N   customer ──< orders
M:N   students >──< courses   (via junction table enrollments)
```

```sql
CREATE TABLE enrollments (
    student_id INT REFERENCES students(id),
    course_id  INT REFERENCES courses(id),
    PRIMARY KEY (student_id, course_id)
);
```

---

## ✅ Practice
1. Create `students`, `courses`, `enrollments`.
2. Add a `CHECK` on course credits (1–6).
3. Try inserting a duplicate primary key and observe the error.
4. Use `ALTER TABLE` to add and drop a column.

## 🧠 Self-check
- Natural vs surrogate key trade-offs?
- Why not use `REAL` for money?
- What is a junction table?

## 📓 Notebook
[class27.ipynb](./class27.ipynb)
