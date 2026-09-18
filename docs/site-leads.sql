-- Run in Supabase SQL editor for production lead inbox
create extension if not exists "pgcrypto";

create table if not exists site_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null default 'lead-magnet',
  product text not null default 'General',
  name text not null,
  email text,
  phone text,
  message text,
  source text default 'website',
  status text not null default 'new'
);

create index if not exists site_leads_created_at_idx on site_leads (created_at desc);
create index if not exists site_leads_status_idx on site_leads (status);
