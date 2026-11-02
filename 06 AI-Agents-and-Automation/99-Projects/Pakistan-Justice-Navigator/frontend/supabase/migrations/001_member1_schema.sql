-- Pakistan Justice Navigator — Member 1 / shared case schema
-- This migration is intentionally separate from the legal RAG chunk schema.

create extension if not exists pgcrypto;

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete set null,
  public_case_id text not null unique,
  language text not null default 'roman-ur' check (language in ('en', 'roman-ur', 'ur')),
  category text,
  summary text,
  urgency text check (urgency in ('low', 'medium', 'high')),
  status text not null default 'intake' check (status in ('intake', 'analysis', 'ready_for_lawyer', 'closed')),
  raw_description text not null,
  structured_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  role text not null check (role in ('citizen', 'assistant', 'system')),
  language text not null default 'roman-ur',
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  storage_path text not null,
  original_file_name text not null,
  mime_type text,
  status text not null default 'uploaded'
    check (status in ('uploaded', 'queued', 'processing', 'analyzed', 'failed')),
  analysis_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.legal_documents (
  document_id text primary key,
  title text not null,
  document_type text not null,
  jurisdiction text not null,
  court text,
  authority text not null,
  citation text,
  case_number text,
  case_year integer,
  document_date date,
  section_or_article text,
  parties text,
  language text default 'English',
  source_url text not null,
  file_name text,
  status text not null default 'metadata_only',
  source_tier smallint not null default 1 check (source_tier between 1 and 3),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_cases_user_id on public.cases(user_id);
create index if not exists idx_case_messages_case_id on public.case_messages(case_id);
create index if not exists idx_case_documents_case_id on public.case_documents(case_id);
create index if not exists idx_legal_documents_jurisdiction on public.legal_documents(jurisdiction);

alter table public.cases enable row level security;
alter table public.case_messages enable row level security;
alter table public.case_documents enable row level security;
alter table public.legal_documents enable row level security;

-- Citizens can only read/write their own authenticated case rows.
create policy "users_select_own_cases"
on public.cases for select
to authenticated
using (auth.uid() = user_id);

create policy "users_insert_own_cases"
on public.cases for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users_update_own_cases"
on public.cases for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users_select_own_case_messages"
on public.case_messages for select
to authenticated
using (
  exists (
    select 1 from public.cases c
    where c.id = case_messages.case_id
      and c.user_id = auth.uid()
  )
);

create policy "users_insert_own_case_messages"
on public.case_messages for insert
to authenticated
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_messages.case_id
      and c.user_id = auth.uid()
  )
);

create policy "users_select_own_case_documents"
on public.case_documents for select
to authenticated
using (
  exists (
    select 1 from public.cases c
    where c.id = case_documents.case_id
      and c.user_id = auth.uid()
  )
);

-- Tier-1 legal metadata is public-readable once the corpus team has verified it.
create policy "public_read_verified_legal_metadata"
on public.legal_documents for select
to anon, authenticated
using (status in ('verified', 'ingested'));

-- Do not expose service-role/secret keys in the browser.
-- Backend/member 4 should own writes to legal_documents and vector/chunk tables.
