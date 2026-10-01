# 12 — Database Architecture

## 🎯 Goals
- Understand OLTP vs OLAP and warehouse modeling
- Scale databases (partitioning, replication, sharding)
- Design for availability, recovery, and observability
- Reason about distributed-database trade-offs

## 📚 Topics
1. Application architecture layers
2. OLTP vs OLAP
3. Data warehousing (star/snowflake, SCD, ETL/ELT)
4. Partitioning
5. Replication
6. High availability
7. Scaling and sharding
8. Connection pooling and caching
9. Backup and recovery
10. Monitoring
11. Distributed systems concepts

---

## 1. Layers

```text
Frontend → API → Services / Business Logic → Repository / ORM → Database
                                           ↘ Cache, Pool, Replicas, Backups, Monitoring
```

Growth path:

```text
Small app → Production app → Enterprise database → Distributed database
```

## 2. OLTP vs OLAP

| | OLTP | OLAP |
|--|------|------|
| Purpose | Run the business | Analyze the business |
| Examples | Banking, orders, CRM | BI, reporting, warehouse |
| Queries | Many small | Few large |
| Access | Row-oriented, writes | Column-oriented, scans/aggregates |
| Schema | Normalized | Star / snowflake |
| Consistency | Strong | Often batch-updated |

## 3. Data Warehousing

```text
Sources → ETL/ELT → Staging → Warehouse → BI / ML
```

**Star schema**

```text
            dim_date
               │
dim_product ── fact_sales ── dim_customer
               │
            dim_store
```

- **Fact table:** measurable events (quantity, amount)
- **Dimension table:** descriptive context (who, what, when, where)
- **Snowflake:** normalized dimensions
- **Slowly Changing Dimensions:** Type 1 overwrite, Type 2 new row with validity dates, Type 3 previous-value column
- **Data lake / lakehouse:** raw files + table formats (Parquet, Delta, Iceberg)
- ETL (transform before load) vs ELT (load then transform in the warehouse)

## 4. Partitioning

```sql
CREATE TABLE events (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL,
    payload JSONB
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2024_01 PARTITION OF events
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

| Type | Use |
|------|-----|
| Range | Time series, dates |
| List | Region, tenant |
| Hash | Even distribution |

Benefits: partition pruning, cheap deletion of old data (`DROP PARTITION`), maintenance on smaller units.
Note: partitioning is *within* one server; sharding spans servers.

## 5. Replication

```text
Primary (writes) ──WAL──> Replica 1 (reads)
                     └──> Replica 2 (reads / reporting)
```

| Type | Notes |
|------|-------|
| Physical / streaming | Byte-level copy, whole cluster |
| Logical | Per-table, cross-version, selective |
| Synchronous | No data loss, higher latency |
| Asynchronous | Faster, possible **replication lag** |

Uses: availability, read scaling, disaster recovery, reporting.
⚠️ Read-your-writes problem with lagging replicas.

## 6. High Availability

Failover, automatic promotion, health checks, leader/follower, virtual IP/DNS, load balancing, connection routing.
Tools: **Patroni**, **repmgr**, **pgBouncer**, **HAProxy**, managed services (RDS, Cloud SQL, Azure).
Metrics: **RTO** (time to recover), **RPO** (acceptable data loss).

## 7. Scaling

| Vertical | Horizontal |
|----------|-----------|
| More CPU/RAM/faster disks | Read replicas, partitioning, sharding, distributed DBs |
| Simple, has a ceiling | Complex, scales further |

**Sharding:** split data across nodes by a **shard key**.
Concerns: hot shards, cross-shard joins/transactions, rebalancing, consistency. Tools: Citus, Vitess, application-level sharding.

## 8. Pooling and Caching

- **Connection pooling** (pgBouncer, app pools): PG connections are expensive.
- **Caching** (Redis, app cache): cache-aside, TTLs, invalidation.
- **Database proxy** for routing and pooling.

## 9. Backup and Recovery

| Type | Notes |
|------|-------|
| Logical | `pg_dump`, `pg_dumpall` |
| Physical | `pg_basebackup`, snapshots |
| Continuous | WAL archiving → **Point-in-Time Recovery** |

```bash
pg_dump -U postgres -Fc sql_lab > sql_lab.dump
pg_restore -U postgres -d sql_lab_restored sql_lab.dump
```

> A backup you have never restored is not a backup. **Test recovery.**

## 10. Monitoring

CPU, memory, disk, connections, query latency, locks/deadlocks, cache hit ratio, transactions/sec, replication lag, storage growth, index usage, bloat.

```sql
SELECT * FROM pg_stat_activity;
SELECT * FROM pg_stat_user_tables;
SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
```

Tools: pg_stat_statements, Prometheus + postgres_exporter, Grafana, pgBadger.

## 11. Distributed Concepts

- **CAP theorem:** under a network partition choose consistency or availability
- **Consistency models:** strong, eventual, causal
- **Distributed transactions:** 2PC, Saga pattern
- **CQRS**, **Event Sourcing**
- **Polyglot persistence:** right database for each job (relational, document, key-value, graph, search, vector)
- **NewSQL:** CockroachDB, YugabyteDB, Spanner

## 12. Design Checklist

```text
Data volume? Read/write ratio? Concurrency? Latency targets?
Consistency needs? RPO/RTO? Growth rate? Compliance? Budget? Team skills?
```

---

## ✅ Practice
1. Convert the sample schema into a star schema.
2. Create a range-partitioned table and check pruning with `EXPLAIN`.
3. Set up streaming replication with two Docker containers.
4. Take a `pg_dump` and restore to a new database.
5. Draw an architecture diagram for a 1M-user app.

## 🧠 Self-check
- Partitioning vs sharding?
- RPO vs RTO?
- Why can async replicas serve stale reads?

## 📓 Notebook
[class37.ipynb](./class37.ipynb)
