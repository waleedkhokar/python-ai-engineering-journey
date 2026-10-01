# 05 — JOINs

## 🎯 Goals
- Combine data from multiple tables
- Choose the correct join type
- Avoid duplicate rows and join explosions

## 📚 Topics
1. Relationship types and cardinality
2. `INNER`, `LEFT`, `RIGHT`, `FULL OUTER`, `CROSS`, `SELF` joins
3. `USING` and `NATURAL`
4. Multi-table joins
5. Filtering before/after joins (`ON` vs `WHERE`)
6. Anti-joins and semi-joins
7. Common pitfalls

---

## 1. Cardinality

```text
One-to-One    user ── profile
One-to-Many   customer ──< orders
Many-to-Many  orders >──< products   (via order_items)
```

```text
Customer → Orders → Order Items → Products
```

## 2. Join Types

```sql
-- INNER: only matching rows
SELECT c.name, o.id, o.order_date
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;

-- LEFT: all customers, matched orders or NULL
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;

-- RIGHT: all orders, matched customers or NULL
SELECT c.name, o.id
FROM customers c
RIGHT JOIN orders o ON c.id = o.customer_id;

-- FULL OUTER: everything from both sides
SELECT e.first_name, d.name
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;

-- CROSS: every combination
SELECT c.name, cat.name
FROM customers c CROSS JOIN categories cat;

-- SELF: employee and manager
SELECT e.first_name AS employee, m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

| Join | Returns |
|------|---------|
| `INNER` | Matches only |
| `LEFT` | All left + matches |
| `RIGHT` | All right + matches |
| `FULL` | All rows from both |
| `CROSS` | Cartesian product |
| `SELF` | Table joined to itself |

## 3. Multi-table Join

```sql
SELECT c.name AS customer, o.id AS order_id, p.name AS product,
       oi.quantity, oi.unit_price, oi.quantity * oi.unit_price AS line_total
FROM customers c
JOIN orders o       ON o.customer_id = c.id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p     ON p.id = oi.product_id
ORDER BY o.id;
```

## 4. Anti-join (rows with no match)

```sql
SELECT c.*
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

## 5. ON vs WHERE with LEFT JOIN

```sql
-- Keeps all customers; only paid orders attached
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid';

-- Turns into an INNER JOIN effectively!
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';
```

## 6. Pitfalls

- **Join explosion:** joining two one-to-many tables multiplies rows → wrong `SUM`s.
- **Duplicate rows:** joining on a non-unique key.
- **NULL join keys** never match.
- **Missing join condition** → accidental cross join.
- **Ambiguous column names** → always qualify with aliases.

---

## ✅ Practice
1. Every order with its customer name.
2. Customers who never ordered.
3. Total revenue per customer (non-cancelled orders).
4. Employee → manager list.
5. Products never sold.
6. Revenue per category.

## 🧠 Self-check
- INNER vs LEFT JOIN?
- Why can `WHERE` break a `LEFT JOIN`?
- What's a join explosion?

## 📓 Notebook
[class30.ipynb](./class30.ipynb)
