# 13 — SQL + Python

## 🎯 Goals
- Connect Python applications to PostgreSQL
- Use Pandas with SQL
- Use SQLAlchemy Core and ORM
- Structure a FastAPI + database application

## 📚 Topics
1. `psycopg` and parameterized queries
2. Pandas `read_sql` / `to_sql`
3. SQLAlchemy engine, Core, ORM
4. Migrations (Alembic)
5. Connection pooling
6. FastAPI integration
7. Raw SQL vs ORM

---

## 1. psycopg

```bash
pip install "psycopg[binary]"
```

```python
import psycopg

with psycopg.connect("postgresql://postgres:postgres@localhost:5432/sql_lab") as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT id, name FROM customers WHERE country = %s", ("Pakistan",))
        for row in cur.fetchall():
            print(row)
```

Always use `%s` placeholders — never f-strings for values.

## 2. Pandas

```python
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg://postgres:postgres@localhost:5432/sql_lab")

df = pd.read_sql("SELECT * FROM orders", engine)
df.to_sql("orders_copy", engine, if_exists="replace", index=False)
```

```text
Database → SQL → Python → DataFrame → EDA / Visualization / ML
```

Tip: push filtering and aggregation to SQL; pull only what you need.

## 3. SQLAlchemy

```bash
pip install sqlalchemy alembic
```

**Core**

```python
from sqlalchemy import text
with engine.connect() as conn:
    rows = conn.execute(text("SELECT * FROM customers WHERE country = :c"), {"c": "UK"})
```

**ORM**

```python
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase): pass

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    orders: Mapped[list["Order"]] = relationship(back_populates="customer")

class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    customer: Mapped[Customer] = relationship(back_populates="orders")

with Session(engine) as session:
    c = session.get(Customer, 1)
    print([o.id for o in c.orders])
```

Concepts: Engine, Connection, Session, unit of work, identity map, lazy vs eager loading, transactions, **N+1 problem** (`selectinload`, `joinedload`).

## 4. Migrations with Alembic

```bash
alembic init migrations
alembic revision --autogenerate -m "add phone to customers"
alembic upgrade head
alembic downgrade -1
```

## 5. FastAPI Architecture

```text
Client → FastAPI Router → Service Layer → Repository → SQLAlchemy → PostgreSQL
```

```python
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

app = FastAPI()

def get_db():
    with Session(engine) as db:
        yield db

@app.get("/customers/{customer_id}")
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    return db.get(Customer, customer_id)
```

Cover: pooling, sessions, transactions, CRUD, pagination, filtering, error handling, migrations, async (`asyncpg`, `AsyncSession`).

## 6. Raw SQL vs ORM

| Raw SQL / Core | ORM |
|----------------|-----|
| Full control, complex analytics | Fast CRUD, relationships |
| Performance-critical queries | Less boilerplate |
| Harder to maintain at scale | Risk of N+1, hidden queries |

Use **both** where appropriate.

---

## ✅ Practice
1. Query the sample DB with psycopg using parameters.
2. Load an orders query into Pandas and plot revenue by month.
3. Map `customers` and `orders` with the ORM.
4. Reproduce and fix an N+1 problem.
5. Build a small FastAPI CRUD API for products with pagination.

## 🧠 Self-check
- Why are parameterized queries safe?
- What is the N+1 problem?
- When would you use raw SQL in an ORM project?

## 📓 Notebook
[class38.ipynb](./class38.ipynb)
