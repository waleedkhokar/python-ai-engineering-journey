# 04 — Aggregations and GROUP BY

## 🎯 Goals
- Summarize data with aggregate functions
- Group rows and filter groups
- Use `CASE` for conditional logic and pivots

## 📚 Topics
1. `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
2. `COUNT(*)` vs `COUNT(col)` vs `COUNT(DISTINCT col)`
3. `GROUP BY`
4. `HAVING`
5. `CASE` expressions
6. Conditional aggregation (`FILTER`)

---

## 1. Aggregate Functions

```sql
SELECT COUNT(*), SUM(salary), AVG(salary), MIN(salary), MAX(salary)
FROM employees;
```

| Expression | Counts |
|-----------|--------|
| `COUNT(*)` | All rows |
| `COUNT(col)` | Non-NULL values |
| `COUNT(DISTINCT col)` | Distinct non-NULL values |

Aggregates **ignore NULLs** (except `COUNT(*)`).

## 2. GROUP BY

```sql
SELECT department_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
ORDER BY avg_salary DESC;
```

Rule: every non-aggregated column in `SELECT` must appear in `GROUP BY`.

## 3. HAVING

```sql
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 100000;
```

```text
WHERE  → filters rows   (before grouping)
HAVING → filters groups (after grouping)
```

## 4. CASE

```sql
SELECT first_name, salary,
       CASE
         WHEN salary >= 150000 THEN 'High'
         WHEN salary >= 80000  THEN 'Medium'
         ELSE 'Low'
       END AS salary_level
FROM employees;
```

## 5. Conditional Aggregation / Pivot

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'paid')      AS paid,
  COUNT(*) FILTER (WHERE status = 'shipped')   AS shipped,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled
FROM orders;

-- Portable version
SELECT SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) AS paid FROM orders;
```

## 6. Multiple Grouping Columns

```sql
SELECT customer_id, status, COUNT(*)
FROM orders
GROUP BY customer_id, status;
```

---

## ✅ Practice
1. Average salary per department.
2. Departments with more than 2 employees.
3. Number of orders per status.
4. Number of orders per month (`DATE_TRUNC`).
5. Classify products into price tiers with `CASE` and count each tier.

## 🧠 Self-check
- `COUNT(*)` vs `COUNT(phone)`?
- Why can't `WHERE` use `AVG()`?
- What does `AVG` do with NULLs?

## 📓 Notebook
[class29.ipynb](./class29.ipynb)
