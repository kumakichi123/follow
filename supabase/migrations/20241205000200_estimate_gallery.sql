alter table if exists public.estimates
  add column if not exists gallery_description text,
  add column if not exists gallery_images text[] default '{}';
