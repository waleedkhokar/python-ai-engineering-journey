# 08 — Transactions and Concurrency

## 🎯 Goals
- Modify data safely (CRUD)
- Understand transactions and ACID
- Know isolation levels and anomalies
- Understand locking and deadlocks

## 📚 Topics
1. `INSERT`, `UPDATE`, `DELETE`, upsert, `RETURNING`
2. Transactions: `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT`
3. ACID
4. Isolation levels and anomalies
5. MVCC
6. Locks, deadlocks
7. Optimistic vs pessimistic concurrency

---

## 1. Data Modification

```sql
INSERT INTO categories (id, name) VALUES (5, 'Sports');
INSERT INTO categories (id, name) VALUES (6,'Toys'), (7,'Garden');
INSERT INTO archive_orders SELECT * FROM orders WHERE order_date < '2024-03-01';

UPDATE products SET price = price * 1.10 WHERE category_id = 2 RETURNING *;
DELETE FROM orders WHERE status = 'cancelled' RETURNING id;
```

### Upsert

```sql
INSERT INTO products (id, name, price, stock)
VALUES (1, 'Laptop', 1250, 10)
ON CONFLICT (id) DO UPDATE
SET price = EXCLUDED.price, stock = EXCLUDED.stock;
```

> ⚠️ Always check the `WHERE` clause of `UPDATE`/`DELETE`. Run a `SELECT` with the same `WHERE` first, and use a transaction.

| Command | Rows | Structure | Rollback (PG) |
|---------|------|-----------|---------------|
| `DELETE` | selected | kept | ✅ |
| `TRUNCATE` | all | kept | ✅ |
| `DROP` | all | removed | ✅ (DDL is transactional in PG) |

## 2. Transactions

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;      -- or ROLLBACK;
```

Savepoints:

```sql
BEGIN;
INSERT INTO t VALUES (1);
SAVEPOINT sp1;
INSERT INTO t VALUES (2);
ROLLBACK TO sp1;
COMMIT;
```

## 3. ACID

| Property | Meaning |
|----------|---------|
| **Atomicity** | All or nothing |
| **Consistency** | Constraints hold before and after |
| **Isolation** | Concurrent transactions don't interfere improperly |
| **Durability** | Committed data survives crashes (WAL) |

## 4. Isolation Levels

| Level | Dirty read | Non-repeatable read | Phantom |
|-------|:---:|:---:|:---:|
| Read Uncommitted* | possible | possible | possible |
| Read Committed (PG default) | ❌ | possible | possible |
| Repeatable Read | ❌ | ❌ | ❌ in PG (possible in std) |
| Serializable | ❌ | ❌ | ❌ |

\* PostgreSQL treats Read Uncommitted as Read Committed.

Anomalies: **dirty read**, **non-repeatable read**, **phantom read**, **lost update**, **write skew**.

```sql
BEGIN ISOLATION LEVEL SERIALIZABLE;
-- ...
COMMIT;   -- may fail with serialization_failure → retry
```

## 5. MVCC

PostgreSQL uses **Multi-Version Concurrency Control**: readers don't block writers and writers don't block readers; each transaction sees a snapshot. Old row versions are cleaned by `VACUUM`.

## 6. Locks

| Lock | Use |
|------|-----|
| Row-level | `SELECT ... FOR UPDATE`, `FOR SHARE`, `UPDATE`, `DELETE` |
| Table-level | `LOCK TABLE`, DDL |
| Advisory | Application-defined locks |

```sql
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;    -- pessimistic lock
-- ...
COMMIT;

SELECT * FROM jobs WHERE status='new'
FOR UPDATE SKIP LOCKED LIMIT 1;                     -- job queue pattern
```

### Deadlock

```text
T1 locks A, wants B
T2 locks B, wants A   → PostgreSQL aborts one
```

Prevention: lock in consistent order, keep transactions short, retry on failure.

## 7. Optimistic vs Pessimistic

```sql
-- Optimistic: version column
UPDATE products SET stock = stock - 1, version = version + 1
WHERE id = 1 AND version = 7;    -- 0 rows updated → conflict, retry
```

| Pessimistic | Optimistic |
|-------------|-----------|
| Lock first (`FOR UPDATE`) | Detect conflict at write |
| Good for high contention | Good for low contention |

## 8. Useful Monitoring

```sql
SELECT * FROM pg_locks;
SELECT pid, state, query, wait_event FROM pg_stat_activity;
```

---

## ✅ Practice
1. Transfer money between two accounts in a transaction; force a failure and roll back.
2. Two `psql` sessions: reproduce a non-repeatable read under Read Committed.
3. Reproduce a deadlock.
4. Implement an upsert.
5. Use `FOR UPDATE SKIP LOCKED` for a queue.

## 🧠 Self-check
- What does each ACID letter guarantee?
- What's the PG default isolation level?
- How does MVCC avoid read locks?

## 📓 Notebook
[class33.ipynb](./class33.ipynb)
