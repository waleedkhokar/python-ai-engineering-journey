-- Pakistan Justice Navigator — Member 4 legal research / RAG foundation
-- Server-owned corpus tables. Browser clients should not write legal source content.

create extension if not exists vector with schema extensions;

-- Judgment metadata supplied by official court systems should retain the bench.
alter table public.legal_documents add column if not exists bench text;

create table if not exists public.legal_chunks (
  chunk_id text primary key,
  document_id text not null references public.legal_documents(document_id) on delete cascade,
  title text not null,
  document_type text not null,
  jurisdiction text not null,
  court text,
  bench text,
  authority text not null,
  citation text,
  section_or_article text,
  page_start integer,
  page_end integer,
  source_name text not null,
  source_url text not null,
  source_tier smallint not null default 1 check (source_tier between 1 and 3),
  content text not null,
  content_hash text not null,
  fts tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(section_or_article,'') || ' ' || content)
  ) stored,
  embedding extensions.vector(384),
  created_at timestamptz not null default now(),
  unique(document_id, content_hash)
);

alter table public.legal_chunks add column if not exists bench text;

create index if not exists legal_chunks_document_id_idx on public.legal_chunks(document_id);
create index if not exists legal_chunks_fts_idx on public.legal_chunks using gin(fts);
create index if not exists legal_chunks_embedding_hnsw_idx
  on public.legal_chunks using hnsw (embedding vector_cosine_ops)
  where embedding is not null;

alter table public.legal_chunks enable row level security;

-- Least privilege: corpus chunks are queried by the trusted RAG service.
revoke all on table public.legal_chunks from anon, authenticated;
grant select, insert, update, delete on table public.legal_chunks to service_role;

-- Ensure corpus metadata cannot be mutated from browser roles.
revoke insert, update, delete on table public.legal_documents from anon, authenticated;
grant select, insert, update, delete on table public.legal_documents to service_role;

-- Lexical retrieval works immediately after chunk ingestion, before embeddings are configured.
create or replace function public.search_legal_chunks_lexical(
  query_text text,
  match_count integer default 8
)
returns table (
  document_id text,
  title text,
  document_type text,
  jurisdiction text,
  authority text,
  court text,
  bench text,
  citation text,
  section_or_article text,
  source_name text,
  source_url text,
  page_start integer,
  page_end integer,
  snippet text,
  score double precision
)
language sql
stable
security invoker
as $$
  select
    c.document_id,
    c.title,
    c.document_type,
    c.jurisdiction,
    c.authority,
    c.court,
    c.bench,
    c.citation,
    c.section_or_article,
    c.source_name,
    c.source_url,
    c.page_start,
    c.page_end,
    left(c.content, 650) as snippet,
    ts_rank_cd(c.fts, websearch_to_tsquery('english', query_text))::double precision as score
  from public.legal_chunks c
  where c.fts @@ websearch_to_tsquery('english', query_text)
  order by score desc
  limit greatest(1, least(match_count, 20));
$$;

revoke all on function public.search_legal_chunks_lexical(text, integer) from public, anon, authenticated;
grant execute on function public.search_legal_chunks_lexical(text, integer) to service_role;

-- Optional semantic retrieval once a real 384-dimension embedding provider is configured.
create or replace function public.match_legal_chunks(
  query_embedding extensions.vector(384),
  match_threshold double precision default 0.72,
  match_count integer default 8
)
returns table (
  document_id text,
  title text,
  document_type text,
  jurisdiction text,
  authority text,
  court text,
  bench text,
  citation text,
  section_or_article text,
  source_name text,
  source_url text,
  page_start integer,
  page_end integer,
  snippet text,
  score double precision
)
language sql
stable
security invoker
as $$
  select
    c.document_id,
    c.title,
    c.document_type,
    c.jurisdiction,
    c.authority,
    c.court,
    c.bench,
    c.citation,
    c.section_or_article,
    c.source_name,
    c.source_url,
    c.page_start,
    c.page_end,
    left(c.content, 650) as snippet,
    (1 - (c.embedding <=> query_embedding))::double precision as score
  from public.legal_chunks c
  where c.embedding is not null
    and (1 - (c.embedding <=> query_embedding)) >= match_threshold
  order by c.embedding <=> query_embedding
  limit greatest(1, least(match_count, 20));
$$;

revoke all on function public.match_legal_chunks(extensions.vector, double precision, integer) from public, anon, authenticated;
grant execute on function public.match_legal_chunks(extensions.vector, double precision, integer) to service_role;
