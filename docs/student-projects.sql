-- Student research project portal (run in Supabase SQL editor)
-- Safe to re-run: IF NOT EXISTS + additive columns for 50% deposit flow.

create table if not exists student_projects (
  id uuid primary key default gen_random_uuid(),
  request_id text unique not null,
  package_id text not null,
  package_name text not null,
  amount_ngn int not null,
  stage text not null default 'received',
  status text not null default 'pending_payment',
  -- pending_payment | deposit_paid | in_progress | awaiting_balance | fully_paid | completed | cancelled
  name text not null,
  email text not null,
  phone text,
  school text,
  level text,
  topic text not null,
  deadline text,
  notes text,
  paystack_ref text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 50% deposit / 50% balance payment columns
alter table student_projects add column if not exists deposit_ngn int;
alter table student_projects add column if not exists balance_ngn int;
alter table student_projects add column if not exists amount_paid_ngn int not null default 0;
alter table student_projects add column if not exists paystack_ref_deposit text;
alter table student_projects add column if not exists paystack_ref_balance text;
alter table student_projects add column if not exists delivery_url text;
alter table student_projects add column if not exists delivery_unlocked boolean not null default false;

create index if not exists student_projects_request_id_idx on student_projects (request_id);
create index if not exists student_projects_email_idx on student_projects (email);
create index if not exists student_projects_status_idx on student_projects (status);

create table if not exists student_project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references student_projects (id) on delete cascade,
  request_id text not null,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists student_project_messages_request_idx
  on student_project_messages (request_id);

create table if not exists student_project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references student_projects (id) on delete cascade,
  request_id text not null,
  stage text not null,
  note text,
  created_at timestamptz not null default now()
);
