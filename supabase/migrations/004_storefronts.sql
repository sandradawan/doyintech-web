-- DoyinTech Store: WhatsApp storefronts for sellers. Run after 003.
-- All access goes through server routes with the service role; RLS on, no public policies.

create table if not exists public.storefronts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users (id) on delete cascade,
  owner_email text not null,
  slug text not null unique check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])$'),
  name text not null,
  tagline text,
  whatsapp text not null,             -- digits only, international format e.g. 2348012345678
  is_published boolean not null default true,
  -- Online payments: seller's Paystack subaccount; switched on only after admin review.
  payments_status text not null default 'off'
    check (payments_status in ('off', 'pending_review', 'active', 'rejected')),
  paystack_subaccount_code text,
  bank_name text,
  account_name text,
  account_last4 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.storefront_products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.storefronts (id) on delete cascade,
  name text not null,
  description text,
  price_kobo bigint not null check (price_kobo >= 0),
  image_url text,
  in_stock boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists storefront_products_store_idx on public.storefront_products (store_id, sort);

create table if not exists public.storefront_orders (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.storefronts (id) on delete cascade,
  reference text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  items jsonb not null,               -- [{product_id, name, qty, price_kobo}]
  amount_kobo bigint not null check (amount_kobo > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists storefront_orders_store_idx on public.storefront_orders (store_id, created_at desc);

alter table public.storefronts enable row level security;
alter table public.storefront_products enable row level security;
alter table public.storefront_orders enable row level security;
revoke all on public.storefronts, public.storefront_products, public.storefront_orders from anon, authenticated;

-- Public bucket for product images (uploads go through /api/storefront/upload only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('storefront', 'storefront', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
