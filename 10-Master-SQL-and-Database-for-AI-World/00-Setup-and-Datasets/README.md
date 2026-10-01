# 00 — Setup and Datasets

Get a working PostgreSQL environment and a sample database used by every module.

## Option A — Docker (recommended)

```bash
docker run --name sql-lab \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sql_lab \
  -p 5432:5432 -d postgres:16
```

Connect:

```bash
docker exec -it sql-lab psql -U postgres -d sql_lab
```

## Option B — Native install

- **Windows / macOS:** installer from <https://www.postgresql.org/download/>
- **Ubuntu:** `sudo apt install postgresql postgresql-contrib`

## Load the sample dataset

```bash
psql -U postgres -d sql_lab -f schema.sql
psql -U postgres -d sql_lab -f seed.sql
```

With Docker:

```bash
docker cp schema.sql sql-lab:/schema.sql
docker cp seed.sql sql-lab:/seed.sql
docker exec -it sql-lab psql -U postgres -d sql_lab -f /schema.sql
docker exec -it sql-lab psql -U postgres -d sql_lab -f /seed.sql
```

## Sample database

```text
departments ──< employees
customers   ──< orders ──< order_items >── products >── categories
```

| Table | Description |
|-------|-------------|
| `departments` | Company departments |
| `employees` | Employees with manager hierarchy (self-reference) |
| `customers` | Store customers |
| `categories` | Product categories |
| `products` | Products |
| `orders` | Customer orders |
| `order_items` | Line items of orders |

## Useful psql commands

| Command | Meaning |
|---------|---------|
| `\l` | List databases |
| `\c dbname` | Connect to a database |
| `\dt` | List tables |
| `\d table` | Describe a table |
| `\di` | List indexes |
| `\x` | Toggle expanded output |
| `\timing` | Show query time |
| `\q` | Quit |

## Tools

- **psql** (CLI), **pgAdmin**, **DBeaver**, **VS Code** (SQLTools / PostgreSQL extension)
- **Jupyter** with `ipython-sql` or `psycopg` (see notebooks)

## Notebook connection

```python
%load_ext sql
%sql postgresql://postgres:postgres@localhost:5432/sql_lab
```
