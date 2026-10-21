-- DoyinTech security hardening — run in Supabase SQL editor after 001.
-- Safe to re-run. All server routes use the service-role key, which bypasses RLS,
-- so locking tables down here does not break the site.

-- 1) Wallet functions must only be callable by the server (service_role).
--    Without this, anyone holding the public anon key could call
--    /rest/v1/rpc/wallet_credit and mint wallet balance.
revoke execute on function public.wallet_credit(uuid, bigint, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.wallet_try_debit(uuid, bigint, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.wallet_credit(uuid, bigint, text, text, jsonb) to service_role;
grant execute on function public.wallet_try_debit(uuid, bigint, text, text, jsonb) to service_role;

-- Profiles: users may read their row but not rewrite arbitrary columns via PostgREST.
revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- 2) Tables created outside migrations (docs/*.sql, lib/store/schema.sql).
--    Enable RLS with no anon/authenticated policies = server-only access.
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_leads', 'site_orders', 'site_chat_messages', 'site_settings',
    'student_projects', 'student_project_messages', 'student_project_events',
    'store_listings', 'store_orders', 'store_developers', 'store_reviews',
    'store_members', 'store_screenshots', 'store_submissions_log',
    'report_products', 'report_orders', 'report_events',
    'property_listings', 'ops_payment_events',
    'ops_orgs', 'ops_contacts', 'ops_deals', 'ops_invoices', 'ops_quotes', 'ops_tasks'
  ]
  loop
    if to_regclass('public.' || t) is not null then
      execute format('alter table public.%I enable row level security', t);
      execute format('revoke all on public.%I from anon, authenticated', t);
    end if;
  end loop;
end
$$;

-- 3) Tables the code uses but that had no schema anywhere.
create table if not exists public.ops_workspaces (
  user_id uuid primary key references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ops_workspaces enable row level security;
-- /api/ops/workspace queries as the signed-in user, so owners need access to their own row.
drop policy if exists "ops_workspaces_own" on public.ops_workspaces;
create policy "ops_workspaces_own" on public.ops_workspaces
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update on public.ops_workspaces to authenticated;

create table if not exists public.ops_payment_events (
  id uuid primary key default gen_random_uuid(),
  invoice_number text,
  reference text unique,
  amount_kobo bigint,
  email text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.ops_payment_events enable row level security;

-- 4) One-time payment references. A Paystack reference can be redeemed once per kind,
--    which stops replaying one payment to fulfil many orders.
create table if not exists public.payment_claims (
  reference text not null,
  kind text not null,
  product_id text,
  email text,
  amount_kobo bigint,
  created_at timestamptz not null default now(),
  primary key (reference, kind)
);
alter table public.payment_claims enable row level security;
