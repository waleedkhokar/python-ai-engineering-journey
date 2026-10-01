# 11 — Advanced Database

## 🎯 Goals
- Encapsulate logic in the database (views, functions, procedures, triggers)
- Organize databases with schemas and sequences
- Secure a database with roles, permissions, and safe query practices

## 📚 Topics
1. Views and materialized views
2. Functions and stored procedures
3. Triggers
4. Sequences and identity
5. Schemas
6. Temporary tables
7. Roles and permissions
8. Row-level security
9. SQL injection
10. Encryption and auditing

---

## 1. Views

```sql
CREATE VIEW active_customers AS
SELECT * FROM customers WHERE country = 'Pakistan';

CREATE OR REPLACE VIEW order_totals AS
SELECT o.id, o.customer_id, SUM(oi.quantity * oi.unit_price) AS total
FROM orders o JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.customer_id;
```

Uses: simplify queries, reporting, security (expose only some columns).

## 2. Materialized Views

Stores the result physically. Fast reads, stale until refreshed.

```sql
CREATE MATERIALIZED VIEW mv_monthly_revenue AS
SELECT DATE_TRUNC('month', o.order_date) AS month,
       SUM(oi.quantity * oi.unit_price) AS revenue
FROM orders o JOIN order_items oi ON oi.order_id = o.id
WHERE o.status <> 'cancelled'
GROUP BY 1;

CREATE UNIQUE INDEX ON mv_monthly_revenue (month);
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_revenue;
```

| View | Materialized view |
|------|-------------------|
| Query runs each time | Result stored |
| Always fresh | Needs refresh |
| No storage | Uses storage, can be indexed |

## 3. Functions

```sql
CREATE OR REPLACE FUNCTION order_total(p_order_id INT)
RETURNS NUMERIC
LANGUAGE sql STABLE AS $$
    SELECT COALESCE(SUM(quantity * unit_price), 0)
    FROM order_items WHERE order_id = p_order_id;
$$;

SELECT order_total(1);
```

```sql
CREATE OR REPLACE FUNCTION raise_salary(p_id INT, p_pct NUMERIC)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
    UPDATE employees SET salary = salary * (1 + p_pct/100) WHERE id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Employee % not found', p_id;
    END IF;
END $$;
```

Learn: parameters, return types, `RETURNS TABLE`, volatility (`IMMUTABLE`/`STABLE`/`VOLATILE`), `SECURITY DEFINER` (use carefully).

## 4. Procedures

```sql
CREATE PROCEDURE archive_old_orders(p_before DATE)
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO archive_orders SELECT * FROM orders WHERE order_date < p_before;
    DELETE FROM orders WHERE order_date < p_before;
    COMMIT;   -- procedures can control transactions
END $$;

CALL archive_old_orders('2024-01-01');
```

| Function | Procedure |
|----------|-----------|
| Returns a value, used in queries | Invoked with `CALL` |
| Cannot commit/rollback | Can manage transactions |

## 5. Triggers

```sql
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

Events: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`; timing: `BEFORE`, `AFTER`, `INSTEAD OF`; level: `FOR EACH ROW` / `FOR EACH STATEMENT`.

Use cases: audit logs, timestamps, validation, derived data.
⚠️ Too many triggers make behavior hidden and hard to debug.

## 6. Sequences and Identity

```sql
CREATE SEQUENCE invoice_seq START 1000;
SELECT nextval('invoice_seq');

id BIGINT GENERATED ALWAYS AS IDENTITY
```

Sequences are **not gap-free** and not rolled back.

## 7. Schemas

```sql
CREATE SCHEMA sales;
CREATE TABLE sales.invoices (...);
SET search_path TO sales, public;
```

Use for organization (`auth`, `sales`, `hr`, `analytics`) and permissions.

## 8. Temporary Tables

```sql
CREATE TEMP TABLE tmp_paid AS
SELECT * FROM orders WHERE status = 'paid';
```

Session-scoped; good for staging in ETL and complex multi-step queries.

## 9. Roles and Permissions

```sql
CREATE ROLE app_user LOGIN PASSWORD 'change_me';
CREATE ROLE readonly NOLOGIN;

GRANT CONNECT ON DATABASE sql_lab TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly;

GRANT readonly TO reporting_user;
REVOKE INSERT ON customers FROM app_user;
```

Typical users: **application**, **read-only**, **reporting**, **migration**, **admin**.
Principle: **least privilege**.

## 10. Row-Level Security

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_orders ON orders
USING (customer_id = current_setting('app.customer_id')::int);
```

## 11. SQL Injection

```text
User input → unsafe string building → modified SQL → unauthorized behavior
```

❌ Unsafe:

```python
cur.execute(f"SELECT * FROM users WHERE name = '{name}'")
```

✅ Safe (parameterized):

```python
cur.execute("SELECT * FROM users WHERE name = %s", (name,))
```

Also: prepared statements, ORM/query builders, least-privilege DB users, input validation, never expose raw DB errors.

## 12. Other Security Topics

Authentication (SCRAM, SSO), TLS connections, encryption at rest, secrets management, `pgcrypto`, auditing (`pgaudit`), network restrictions (`pg_hba.conf`, firewalls/VPC).

---

## ✅ Practice
1. Create a view of order totals; query it.
2. Build a materialized view of monthly revenue; refresh it.
3. Write a function computing an order total.
4. Add an `updated_at` trigger.
5. Create a read-only role and verify it cannot write.
6. Demonstrate SQL injection on a toy query, then fix it.

## 🧠 Self-check
- View vs materialized view?
- Function vs procedure?
- Why is least privilege important?

## 📓 Notebook
[class36.ipynb](./class36.ipynb)
