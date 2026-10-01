# 09 — Indexes and Performance

## 🎯 Goals
- Understand how indexes work
- Choose the right index type and column order
- Read execution plans
- Optimize queries with evidence

## 📚 Topics
1. Why indexes exist
2. Index types (B-tree, Hash, GIN, GiST, SP-GiST, BRIN)
3. Composite, partial, expression, covering indexes
4. Query execution pipeline
5. `EXPLAIN` / `EXPLAIN ANALYZE`
6. Scan and join algorithms
7. Statistics, `ANALYZE`, `VACUUM`
8. Optimization checklist

---

## 1. Why Indexes?

Without an index the DB does a **sequential scan** (reads the whole table). An index provides a fast lookup path.

```sql
CREATE INDEX idx_customers_email ON customers (email);
CREATE UNIQUE INDEX uq_users_email ON users (email);
DROP INDEX idx_customers_email;
```

Trade-off: faster reads, slower writes, more storage.

## 2. Index Types

| Type | Best for |
|------|----------|
| **B-tree** (default) | `=`, `<`, `>`, `BETWEEN`, `ORDER BY`, prefix `LIKE 'abc%'` |
| **Hash** | Equality only |
| **GIN** | JSONB, arrays, full-text search |
| **GiST** | Geometric, ranges, nearest-neighbor |
| **SP-GiST** | Partitioned search spaces (tries, quadtrees) |
| **BRIN** | Huge, naturally ordered tables (time series) |

## 3. Composite Indexes

```sql
CREATE INDEX idx_orders_status_date ON orders (status, order_date);
```

**Column order matters.** This index helps:

```sql
WHERE status = 'paid'
WHERE status = 'paid' AND order_date > '2024-01-01'
```

but not efficiently: `WHERE order_date > '2024-01-01'` alone (leading column missing).

Rule of thumb: equality columns first, then range column, then sort columns.

## 4. Advanced Indexes

```sql
-- Partial
CREATE INDEX idx_orders_pending ON orders (order_date) WHERE status = 'pending';

-- Expression
CREATE INDEX idx_customers_lower_email ON customers (LOWER(email));

-- Covering (index-only scans)
CREATE INDEX idx_orders_cust ON orders (customer_id) INCLUDE (status, order_date);

-- Concurrent (no long write lock)
CREATE INDEX CONCURRENTLY idx_x ON t (col);
```

Also learn: selectivity, index bloat, `REINDEX`, unused indexes (`pg_stat_user_indexes`).

## 5. Query Execution Pipeline

```text
SQL → Parser → Analyzer → Rewriter → Planner/Optimizer → Executor → Storage → Result
```

The planner estimates costs using table **statistics** and picks the cheapest plan.

## 6. EXPLAIN

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 1;
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE customer_id = 1;
```

> `EXPLAIN ANALYZE` **executes** the query. Wrap `UPDATE`/`DELETE` in a transaction and roll back.

| Node | Meaning |
|------|---------|
| Seq Scan | Full table read |
| Index Scan | Index lookup + heap fetch |
| Index Only Scan | Answered from the index |
| Bitmap Heap Scan | Combine many index hits |
| Nested Loop | Good for small outer set + indexed inner |
| Hash Join | Good for large unsorted inputs |
| Merge Join | Good for pre-sorted inputs |
| Sort / Aggregate | Ordering / grouping |

Read: **cost**, **rows** (estimated vs actual), **actual time**, **loops**, **buffers** (shared hit/read).

Big gap between estimated and actual rows → stale statistics → run `ANALYZE`.

## 7. Maintenance

```sql
ANALYZE customers;
VACUUM (VERBOSE, ANALYZE) orders;
```

## 8. Optimization Checklist

- Select only needed columns
- Filter early; avoid functions on indexed columns (`WHERE LOWER(email)=...` needs an expression index)
- Avoid leading-wildcard `LIKE '%abc'` (use trigram/FTS)
- Avoid `OFFSET` pagination for deep pages → keyset
- Avoid N+1 queries in applications
- Index foreign keys used in joins
- Use `EXISTS` for existence checks
- Beware implicit type casts
- Batch inserts; use `COPY` for bulk loads
- Measure → change one thing → measure again

```text
Slow query → EXPLAIN ANALYZE → bottleneck → fix → re-measure
```

> ⚠️ Never blindly add indexes.

---

## ✅ Practice
1. Generate 1M rows with `generate_series`, run a query, `EXPLAIN ANALYZE`.
2. Add an index and compare timings.
3. Reorder a composite index and see the plan change.
4. Create a partial index and confirm it is used.
5. Show a query that cannot use a plain index on `email` when using `LOWER(email)`.

## 🧠 Self-check
- Why does column order matter?
- When is a Seq Scan better than an Index Scan?
- What does a large estimate/actual mismatch indicate?

## 📓 Notebook
[class34.ipynb](./class34.ipynb)
