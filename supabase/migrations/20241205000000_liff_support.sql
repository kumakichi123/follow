-- Enable LIFF-based linking between estimates and LINE users

alter table if exists public.line_settings
  add column if not exists liff_url text,
  add column if not exists liff_id text;

create table if not exists public.estimate_contacts (
  id uuid primary key default gen_random_uuid(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  token text not null,
  line_user_id text not null,
  display_name text,
  picture_url text,
  linked_at timestamptz not null default timezone('utc', now())
);

alter table public.estimate_contacts
  add constraint estimate_contacts_estimate_line_key unique (estimate_id, line_user_id);

alter table public.estimate_contacts enable row level security;

create policy if not exists "allow insert via token"
  on public.estimate_contacts
  for insert
  with check (
    exists (
      select 1 from public.estimates e
      where e.id = estimate_id
        and e.token = token
    )
  );
