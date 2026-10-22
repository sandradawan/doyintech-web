-- Admin CRM: pipeline fields on leads, an activity timeline, and an audit log of admin changes.
-- Run after 006.

-- Leads become deals: value, next follow-up, owner and private notes.
alter table public.site_leads add column if not exists company text;
alter table public.site_leads add column if not exists value_ngn bigint;
alter table public.site_leads add column if not exists next_follow_up date;
alter table public.site_leads add column if not exists owner text;
alter table public.site_leads add column if not exists notes text;
alter table public.site_leads add column if not exists updated_at timestamptz not null default now();
create index if not exists site_leads_status_idx on public.site_leads (status, created_at desc);
create index if not exists site_leads_email_idx on public.site_leads (lower(email));

-- Notes, calls, WhatsApp chats, meetings and tasks against a lead or any contact email.
create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.site_leads (id) on delete cascade,
  contact_email text,
  kind text not null default 'note' check (kind in ('note', 'call', 'whatsapp', 'email', 'meeting', 'task')),
  body text not null,
  due_at timestamptz,
  done boolean not null default false,
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists crm_activities_lead_idx on public.crm_activities (lead_id, created_at desc);
create index if not exists crm_activities_email_idx on public.crm_activities (lower(contact_email), created_at desc);
create index if not exists crm_activities_due_idx on public.crm_activities (due_at) where done = false;

-- Every create / update / delete made from the admin, with who did it and what changed.
create table if not exists public.admin_audit_log (
  id bigint generated always as identity primary key,
  actor text not null,
  action text not null check (action in ('create', 'update', 'delete')),
  resource text not null,
  record_id text,
  changes jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);

alter table public.crm_activities enable row level security;
alter table public.admin_audit_log enable row level security;
revoke all on public.crm_activities, public.admin_audit_log from anon, authenticated;
