alter table public.estimates
  add column if not exists contract_status text default 'draft',
  add column if not exists contract_plan text,
  add column if not exists contract_slots text[];
