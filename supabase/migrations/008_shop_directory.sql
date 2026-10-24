-- Shop directory (/shops) and paid "Sponsored" placement. Run after 007.

alter table public.storefronts add column if not exists category text;
alter table public.storefronts add column if not exists city text;
alter table public.storefronts add column if not exists featured_until timestamptz;
create index if not exists storefronts_directory_idx
  on public.storefronts (is_published, featured_until desc nulls last);

-- A seller paying to appear first in the directory for 7 or 30 days.
create table if not exists public.storefront_boosts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.storefronts (id) on delete cascade,
  reference text not null unique,              -- also the Paystack reference
  days int not null check (days in (7, 30)),
  amount_kobo bigint not null check (amount_kobo > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  starts_at timestamptz,
  ends_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists storefront_boosts_store_idx on public.storefront_boosts (store_id, created_at desc);

alter table public.storefront_boosts enable row level security;
revoke all on public.storefront_boosts from anon, authenticated;
