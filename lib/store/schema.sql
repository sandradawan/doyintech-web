-- DoyinStore schema (run in Supabase SQL editor)
-- Phase 2 production backend

create extension if not exists "pgcrypto";

create table if not exists store_developers (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email text unique not null,
  website text,
  created_at timestamptz default now()
);

create table if not exists store_listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null check (kind in ('app', 'digital_product')),
  title text not null,
  short_description text not null,
  description text not null,
  developer_id uuid references store_developers(id),
  developer_name text not null,
  developer_email text not null,
  platform text not null,
  price_ngn int not null default 0,
  amount_kobo int not null default 0,
  category text not null default 'Business',
  icon_emoji text default '📦',
  version text default '1.0.0',
  package_type text,
  file_name text,
  file_path text, -- storage path in bucket store-binaries
  file_size_mb numeric,
  sha256 text,
  review_status text not null default 'submitted'
    check (review_status in (
      'draft','submitted','scanning','in_review',
      'changes_requested','approved','rejected','suspended'
    )),
  virus_scan_status text default 'pending'
    check (virus_scan_status in ('pending','clean','flagged','failed')),
  security_notes text,
  downloads int default 0,
  rating_avg numeric default 0,
  rating_count int default 0,
  features jsonb default '[]',
  created_at timestamptz default now(),
  published_at timestamptz
);

create table if not exists store_orders (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references store_listings(id),
  buyer_email text not null,
  amount_kobo int not null,
  paystack_reference text,
  status text not null default 'pending'
    check (status in ('pending','paid','failed','refunded')),
  download_token text unique,
  download_expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists store_submissions_log (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  created_at timestamptz default now()
);

-- Storage bucket (create in dashboard): store-binaries (private)
-- RLS: service role for admin; buyers get signed URLs only after paid/free grant
