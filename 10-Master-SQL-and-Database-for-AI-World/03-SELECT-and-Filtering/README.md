# 03 — SELECT and Filtering

## 🎯 Goals
- Query data confidently with `SELECT`
- Filter, sort, and paginate
- Understand `NULL` and three-valued logic
- Use built-in functions

## 📚 Topics
1. `SELECT`, `DISTINCT`, aliases, expressions
2. `WHERE` and operators
3. `ORDER BY`, `LIMIT`, `OFFSET`
4. `NULL` handling
5. String, numeric, date functions
6. Logical order of execution

---

## 1. SELECT

```sql
SELECT * FROM employees;
SELECT id, first_name, salary FROM employees;
SELECT DISTINCT department_id FROM employees;
SELECT first_name, salary, salary * 12 AS yearly_salary FROM employees;
```

> Avoid `SELECT *` in production code — select only needed columns.

## 2. WHERE

```sql
SELECT * FROM employees WHERE salary > 100000;
SELECT * FROM employees WHERE department_id = 1 AND salary >= 100000;
SELECT * FROM employees WHERE department_id IN (1, 2);
SELECT * FROM employees WHERE salary BETWEEN 80000 AND 150000;
SELECT * FROM employees WHERE first_name LIKE 'A%';
SELECT * FROM employees WHERE first_name ILIKE 'a%';   -- PostgreSQL
```

| Group | Operators |
|-------|-----------|
| Comparison | `=`, `<>`, `!=`, `>`, `<`, `>=`, `<=` |
| Logical | `AND`, `OR`, `NOT` |
| Range | `BETWEEN` |
| Membership | `IN`, `NOT IN` |
| Pattern | `LIKE`, `ILIKE` (`%` any chars, `_` one char) |
| Null test | `IS NULL`, `IS NOT NULL` |

## 3. Sorting and Pagination

```sql
SELECT * FROM employees ORDER BY salary DESC;
SELECT * FROM employees ORDER BY department_id ASC, salary DESC;
SELECT * FROM employees ORDER BY id LIMIT 5 OFFSET 10;
```

> ⚠️ Large `OFFSET` values are slow (the DB still reads skipped rows). Later learn **keyset pagination**:
> ```sql
> SELECT * FROM employees WHERE id > 100 ORDER BY id LIMIT 20;
> ```

## 4. NULL

`NULL` means **unknown / missing** — not `0`, not `''`, not `false`.

```sql
SELECT * FROM customers WHERE phone IS NULL;      -- ✅
SELECT * FROM customers WHERE phone = NULL;       -- ❌ never true
SELECT COALESCE(phone, 'N/A') FROM customers;
SELECT NULLIF(stock, 0) FROM products;
```

Three-valued logic: `TRUE`, `FALSE`, `UNKNOWN`.

| Expression | Result |
|-----------|--------|
| `NULL = NULL` | NULL |
| `NULL AND FALSE` | FALSE |
| `NULL OR TRUE` | TRUE |
| `x NOT IN (1, NULL)` | never TRUE ⚠️ |

## 5. Functions

```sql
-- String
SELECT LOWER(first_name), UPPER(last_name), LENGTH(email),
       TRIM('  hi  '), SUBSTRING(email FROM 1 FOR 4),
       REPLACE(email, '@corp.com', ''), CONCAT(first_name, ' ', last_name)
FROM employees;

-- Numeric
SELECT ROUND(123.456, 1), CEIL(4.2), FLOOR(4.8), ABS(-5);

-- Date
SELECT CURRENT_DATE, CURRENT_TIMESTAMP,
       EXTRACT(YEAR FROM hire_date), DATE_TRUNC('month', hire_date),
       AGE(hire_date)
FROM employees;
```

## 6. Logical Order of Execution

```text
FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
```

This is why you cannot use a `SELECT` alias inside `WHERE`.

---

## ✅ Practice
1. Employees hired after 2021 in Engineering (dept 1).
2. Customers without a phone number.
3. Top 3 highest-paid employees.
4. Products whose name contains "book" (case-insensitive).
5. Employees with no department.

## 🧠 Self-check
- Why does `WHERE phone = NULL` return nothing?
- Why can't you use an alias in `WHERE`?
- What's wrong with `NOT IN` on nullable subqueries?

## 📓 Notebook
[class28.ipynb](./class28.ipynb)
