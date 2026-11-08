-- Member 1 persistence polish
-- Anonymous Supabase Auth users receive the authenticated role and therefore use the existing owner policies.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cases_set_updated_at on public.cases;
create trigger cases_set_updated_at
before update on public.cases
for each row execute function public.set_updated_at();

-- Explicit document-write policies for the later secure upload service.
create policy "users_insert_own_case_documents"
on public.case_documents for insert
to authenticated
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_documents.case_id
      and c.user_id = auth.uid()
  )
);

create policy "users_update_own_case_documents"
on public.case_documents for update
to authenticated
using (
  exists (
    select 1 from public.cases c
    where c.id = case_documents.case_id
      and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_documents.case_id
      and c.user_id = auth.uid()
  )
);
