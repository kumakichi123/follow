alter table if exists public.estimates
  add column if not exists matsu_label text,
  add column if not exists matsu_description text,
  add column if not exists take_label text,
  add column if not exists take_description text,
  add column if not exists ume_label text,
  add column if not exists ume_description text;
