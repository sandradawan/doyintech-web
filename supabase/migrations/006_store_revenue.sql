-- DoyinTech Store revenue features. Run after 005.
-- 1. Free shops can take online payments for a per-order platform fee (Store plan: no fee).
-- 2. Delivery fees by area and discount codes.
-- 3. Payment links: sellers send a "Pay now" link for an invoice; reminders by email.

-- Delivery areas the seller charges for: [{ "name": "Jos North", "fee_kobo": 150000 }, ...]
alter table public.storefronts add column if not exists delivery_zones jsonb not null default '[]'::jsonb;

alter table public.storefront_orders add column if not exists subtotal_kobo bigint;
alter table public.storefront_orders add column if not exists delivery_zone text;
alter table public.storefront_orders add column if not exists delivery_fee_kobo bigint not null default 0;
alter table public.storefront_orders add column if not exists delivery_address text;
alter table public.storefront_orders add column if not exists discount_code text;
alter table public.storefront_orders add column if not exists discount_kobo bigint not null default 0;
alter table public.storefront_orders add column if not exists platform_fee_kobo bigint not null default 0;

create table if not exists public.storefront_discounts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.storefronts (id) on delete cascade,
  code text not null check (code ~ '^[A-Z0-9]{3,20}$'),
  percent_off int check (percent_off between 1 and 90),
  amount_off_kobo bigint check (amount_off_kobo > 0),
  min_subtotal_kobo bigint not null default 0,
  max_uses int check (max_uses > 0),
  uses int not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (store_id, code),
  check ((percent_off is null) <> (amount_off_kobo is null))
);

create table if not exists public.storefront_payment_requests (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.storefronts (id) on delete cascade,
  reference text not null unique,          -- public id in the link, e.g. PR_lx2k9a_3f9c1b2e
  title text not null,                     -- e.g. "Invoice INV-0042"
  description text,
  amount_kobo bigint not null check (amount_kobo >= 10000),
  customer_name text,
  customer_email text,
  due_date date,
  status text not null default 'open' check (status in ('open', 'paid', 'cancelled')),
  platform_fee_kobo bigint not null default 0,
  paystack_reference text,
  paid_at timestamptz,
  reminders_sent int not null default 0,
  last_reminded_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists storefront_payment_requests_store_idx
  on public.storefront_payment_requests (store_id, created_at desc);
create index if not exists storefront_payment_requests_due_idx
  on public.storefront_payment_requests (due_date) where status = 'open';

alter table public.storefront_discounts enable row level security;
alter table public.storefront_payment_requests enable row level security;
revoke all on public.storefront_discounts, public.storefront_payment_requests from anon, authenticated;
