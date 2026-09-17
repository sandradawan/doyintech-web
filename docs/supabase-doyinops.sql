-- DoyinOps cloud schema (future multi-tenant)
-- Run in Supabase SQL editor when enabling cloud sync.

create extension if not exists "pgcrypto";

create table if not exists ops_orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_user_id uuid references auth.users(id),
  profile jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists ops_contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references ops_orgs(id) on delete cascade,
  name text not null,
  business text,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists ops_deals (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references ops_orgs(id) on delete cascade,
  contact_id uuid references ops_contacts(id) on delete set null,
  title text not null,
  stage text not null default 'lead',
  value_ngn numeric default 0,
  notes text,
  next_follow_up date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ops_invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references ops_orgs(id) on delete cascade,
  contact_id uuid references ops_contacts(id) on delete set null,
  number text not null,
  amount_ngn numeric not null,
  status text not null default 'sent',
  description text,
  due_date date,
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists ops_quotes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references ops_orgs(id) on delete cascade,
  contact_id uuid references ops_contacts(id) on delete set null,
  number text not null,
  amount_ngn numeric not null,
  status text not null default 'draft',
  description text,
  valid_until date,
  created_at timestamptz default now()
);

create table if not exists ops_tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references ops_orgs(id) on delete cascade,
  contact_id uuid references ops_contacts(id) on delete set null,
  title text not null,
  done boolean default false,
  due_date date,
  created_at timestamptz default now()
);

-- Enable RLS when wiring auth; policies should scope by org membership.
