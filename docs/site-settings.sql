-- Site settings (pricing overrides, feature flags). Safe to re-run.
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Service role bypasses RLS; no public policies needed for writes.
