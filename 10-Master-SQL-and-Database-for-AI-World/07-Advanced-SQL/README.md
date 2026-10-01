# 07 — Advanced SQL

## 🎯 Goals
- Analyze data with window functions
- Query hierarchies with recursive CTEs
- Build multi-level reports
- Work with JSONB, arrays, and full-text search

## 📚 Topics
1. Window functions
2. Recursive CTEs
3. `GROUPING SETS`, `ROLLUP`, `CUBE`
4. `LATERAL` joins
5. JSON / JSONB
6. Arrays
7. Full-text search
8. Date series and gaps

---

## 1. Window Functions

Compute across related rows **without collapsing them**.

```sql
SELECT first_name, department_id, salary,
       ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS row_num,
       RANK()       OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk,
       DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dense_rnk
FROM employees;
```

| Function | Purpose |
|----------|---------|
| `ROW_NUMBER()` | Unique sequence |
| `RANK()` / `DENSE_RANK()` | Ranking with/without gaps |
| `NTILE(n)` | Split into n buckets |
| `LAG()` / `LEAD()` | Previous / next row value |
| `FIRST_VALUE()` / `LAST_VALUE()` | Frame boundaries |
| `SUM() OVER` / `AVG() OVER` | Running / moving aggregates |

```sql
-- Running total
SELECT order_date,
       SUM(COUNT(*)) OVER (ORDER BY order_date) AS running_orders
FROM orders GROUP BY order_date;

-- Month-over-month change
SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly_revenue;

-- 3-row moving average
AVG(x) OVER (ORDER BY d ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
```

Top-N per group:

```sql
SELECT * FROM (
  SELECT e.*, ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM employees e
) t WHERE rn <= 2;
```

> ⚠️ Default frame with `ORDER BY` is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` — beware with `LAST_VALUE`.

## 2. Recursive CTEs

```sql
WITH RECURSIVE org AS (
    SELECT id, first_name, manager_id, 1 AS level
    FROM employees WHERE manager_id IS NULL
  UNION ALL
    SELECT e.id, e.first_name, e.manager_id, o.level + 1
    FROM employees e JOIN org o ON e.manager_id = o.id
)
SELECT * FROM org ORDER BY level;
```

Use cases: org charts, categories, folders, bill of materials, graph traversal. Always guard against cycles.

## 3. Advanced Aggregation

```sql
SELECT c.name AS category, o.status, SUM(oi.quantity * oi.unit_price) AS revenue
FROM order_items oi
JOIN orders o     ON o.id = oi.order_id
JOIN products p   ON p.id = oi.product_id
JOIN categories c ON c.id = p.category_id
GROUP BY ROLLUP (c.name, o.status);

GROUP BY CUBE (a, b);
GROUP BY GROUPING SETS ((a), (b), ());
```

Use `GROUPING()` to distinguish subtotal NULLs from real NULLs.

## 4. LATERAL

```sql
SELECT c.name, recent.id, recent.order_date
FROM customers c
LEFT JOIN LATERAL (
    SELECT * FROM orders o
    WHERE o.customer_id = c.id
    ORDER BY order_date DESC LIMIT 2
) recent ON TRUE;
```

## 5. JSON / JSONB

```sql
CREATE TABLE events (id SERIAL PRIMARY KEY, payload JSONB);

INSERT INTO events (payload)
VALUES ('{"user":"ali","tags":["a","b"],"meta":{"age":30}}');

SELECT payload->>'user'            AS user_name,
       payload->'meta'->>'age'     AS age,
       payload @> '{"user":"ali"}' AS is_ali
FROM events;

CREATE INDEX idx_events_payload ON events USING GIN (payload);
```

| Operator | Meaning |
|----------|---------|
| `->` | Get JSON object/element |
| `->>` | Get as text |
| `@>` | Contains |
| `?` | Key exists |
| `#>` | Path |

Use JSONB for flexible/sparse attributes; use columns for core, queried, constrained data.

## 6. Arrays

```sql
CREATE TABLE posts (id SERIAL PRIMARY KEY, tags TEXT[]);
INSERT INTO posts (tags) VALUES (ARRAY['sql','db']);

SELECT * FROM posts WHERE 'sql' = ANY(tags);
SELECT * FROM posts WHERE tags @> ARRAY['sql'];
SELECT UNNEST(tags) FROM posts;
SELECT ARRAY_AGG(name) FROM categories;
```

## 7. Full-Text Search

```sql
SELECT * FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'database & index');

ALTER TABLE articles ADD COLUMN tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;
CREATE INDEX idx_articles_tsv ON articles USING GIN (tsv);

SELECT title, ts_rank(tsv, q) FROM articles, to_tsquery('english','sql') q
WHERE tsv @@ q ORDER BY 2 DESC;
```

Concepts: tokenization, stemming, stop words, ranking, GIN indexes.

## 8. Generate Series

```sql
SELECT d::date
FROM generate_series('2024-01-01'::date, '2024-01-31', '1 day') d;
```

---

## ✅ Practice
1. Rank employees by salary within each department.
2. Second-highest salary per department.
3. Month-over-month revenue growth with `LAG`.
4. Running revenue total.
5. Full reporting chain per employee with a recursive CTE.
6. Sales subtotals with `ROLLUP`.
7. Store and query a JSONB column; add a GIN index.

## 🧠 Self-check
- `ROW_NUMBER` vs `RANK` vs `DENSE_RANK`?
- Window function vs `GROUP BY`?
- When choose JSONB over columns?

## 📓 Notebook
[class32.ipynb](./class32.ipynb)
