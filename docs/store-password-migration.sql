-- Add password_hash for secure developer auth (run in Supabase SQL editor)
alter table public.store_developers
  add column if not exists password_hash text;

comment on column public.store_developers.password_hash is
  'scrypt$N$r$p$salt$hash — never store plaintext passwords';
