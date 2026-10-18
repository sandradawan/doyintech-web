-- DoyinTech AI Report Studio
-- Run in Supabase SQL editor

create table if not exists report_products (
  id text primary key,
  name text not null,
  description text,
  price_ngn int not null,
  report_type text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists report_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text unique not null,
  product_id text not null,
  product_name text not null,
  price_ngn int not null,
  status text not null default 'pending_payment',
  name text not null,
  email text not null,
  phone text,
  profile_url text,
  business_category text,
  business_objective text,
  target_audience text,
  notes text,
  source_data jsonb,
  paystack_ref text,
  amount_paid_ngn int,
  report_content jsonb,
  delivery_token text unique,
  delivered_at timestamptz,
  admin_notes text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists report_orders_order_id_idx on report_orders (order_id);
create index if not exists report_orders_email_idx on report_orders (email);
create index if not exists report_orders_status_idx on report_orders (status);
create index if not exists report_orders_delivery_token_idx on report_orders (delivery_token);

create table if not exists report_events (
  id uuid primary key default gen_random_uuid(),
  order_uuid uuid not null references report_orders (id) on delete cascade,
  order_id text not null,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists report_events_order_idx on report_events (order_id);

insert into report_products (id, name, description, price_ngn, report_type, is_active)
values
  ('ig-basic', 'Basic Instagram Audit', 'Profile review and five practical recommendations', 3000, 'instagram_audit', true),
  ('ig-pro', 'Professional Instagram Audit', 'Detailed analysis, branding, content recommendations', 10000, 'instagram_audit', true),
  ('ig-growth', 'Growth Strategy Report', 'Full audit plus 30-day content action plan', 25000, 'instagram_audit', true),
  ('biz-profile', 'AI Business Profile Report', 'Website + social presence + digital readiness', 15000, 'business_profile', true),
  ('cv-improve', 'CV Improvement Report', 'Structured feedback and rewrite guidance for your CV', 5000, 'cv_report', true)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  price_ngn = excluded.price_ngn,
  report_type = excluded.report_type,
  is_active = excluded.is_active;
