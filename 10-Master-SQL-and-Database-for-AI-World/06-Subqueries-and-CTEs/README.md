# 06 — Subqueries and CTEs

## 🎯 Goals
- Nest queries correctly
- Use `EXISTS` vs `IN`
- Structure complex queries with CTEs
- Combine result sets

## 📚 Topics
1. Scalar, row, table subqueries
2. Correlated subqueries
3. `IN`, `NOT IN`, `EXISTS`, `NOT EXISTS`, `ANY`, `ALL`
4. Subqueries in `FROM`
5. CTEs (`WITH`)
6. Set operations: `UNION`, `UNION ALL`, `INTERSECT`, `EXCEPT`

---

## 1. Subquery Types

```sql
-- Scalar
SELECT * FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Multi-row
SELECT * FROM products
WHERE category_id IN (SELECT id FROM categories WHERE name IN ('Books','Home'));

-- Derived table (FROM)
SELECT d.name, s.avg_salary
FROM departments d
JOIN (SELECT department_id, AVG(salary) AS avg_salary
      FROM employees GROUP BY department_id) s
  ON s.department_id = d.id;
```

## 2. Correlated Subquery

Runs conceptually once per outer row.

```sql
SELECT e.first_name, e.salary
FROM employees e
WHERE e.salary > (
    SELECT AVG(salary) FROM employees WHERE department_id = e.department_id
);
```

## 3. EXISTS

```sql
SELECT c.name
FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

SELECT c.name
FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
```

> ⚠️ Prefer `NOT EXISTS` over `NOT IN` when the subquery may return `NULL`.

## 4. CTEs

```sql
WITH order_totals AS (
    SELECT order_id, SUM(quantity * unit_price) AS total
    FROM order_items
    GROUP BY order_id
),
paid_orders AS (
    SELECT o.id, o.customer_id, t.total
    FROM orders o JOIN order_totals t ON t.order_id = o.id
    WHERE o.status = 'paid'
)
SELECT c.name, SUM(p.total) AS revenue
FROM paid_orders p
JOIN customers c ON c.id = p.customer_id
GROUP BY c.name
ORDER BY revenue DESC;
```

Benefits: readability, step-by-step logic, reuse within one query.

> In PostgreSQL 12+, non-recursive CTEs are inlined by default; use `MATERIALIZED` / `NOT MATERIALIZED` to control it.

## 5. Set Operations

```sql
SELECT country FROM customers
UNION           -- removes duplicates
SELECT 'Pakistan';

SELECT id FROM customers
INTERSECT       -- common rows
SELECT customer_id FROM orders;

SELECT id FROM customers
EXCEPT          -- rows in first not in second
SELECT customer_id FROM orders;
```

| Operator | Behavior |
|----------|----------|
| `UNION` | Combine, remove duplicates |
| `UNION ALL` | Combine, keep duplicates (faster) |
| `INTERSECT` | Rows in both |
| `EXCEPT` | Rows in first only |

Rules: same number of columns, compatible types.

## 6. Which to Use?

| Need | Prefer |
|------|--------|
| Existence check | `EXISTS` |
| Readable multi-step logic | CTE |
| Combine columns from tables | `JOIN` |
| Compare to aggregate | Scalar subquery / window function |

---

## ✅ Practice
1. Employees earning above the company average.
2. Employees earning above their department average.
3. Customers with at least one paid order (`EXISTS`).
4. Top spender using a CTE.
5. Customers who ordered both Electronics and Books.

## 🧠 Self-check
- `IN` vs `EXISTS`?
- Why is `NOT IN` risky with NULLs?
- `UNION` vs `UNION ALL`?

## 📓 Notebook
[class31.ipynb](./class31.ipynb)
