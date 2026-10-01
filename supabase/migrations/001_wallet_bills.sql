-- DoyinTech Bills Wallet — run in Supabase SQL editor
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  phone text,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  balance_kobo bigint not null default 0 check (balance_kobo >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  entry_type text not null check (entry_type in ('credit', 'debit')),
  amount_kobo bigint not null check (amount_kobo > 0),
  balance_after_kobo bigint not null check (balance_after_kobo >= 0),
  reference text not null,
  reason text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists wallet_ledger_fund_ref_uidx
  on public.wallet_ledger (reference)
  where reason = 'wallet_fund';

create index if not exists wallet_ledger_user_created_idx
  on public.wallet_ledger (user_id, created_at desc);

create table if not exists public.bill_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('airtime', 'data')),
  network text,
  phone text not null,
  amount_kobo bigint not null check (amount_kobo > 0),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'success', 'failed', 'refunded')),
  request_id text not null unique,
  variation_code text,
  provider text not null default 'vtpass',
  provider_response jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bill_orders_user_created_idx
  on public.bill_orders (user_id, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  insert into public.wallets (user_id, balance_kobo)
  values (new.id, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.wallet_try_debit(
  p_user_id uuid,
  p_amount_kobo bigint,
  p_reference text,
  p_reason text,
  p_meta jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new bigint;
begin
  if p_amount_kobo is null or p_amount_kobo <= 0 then
    raise exception 'invalid_amount';
  end if;

  update public.wallets
  set balance_kobo = balance_kobo - p_amount_kobo,
      updated_at = now()
  where user_id = p_user_id
    and balance_kobo >= p_amount_kobo
  returning balance_kobo into v_new;

  if v_new is null then
    raise exception 'insufficient_balance';
  end if;

  insert into public.wallet_ledger (
    user_id, entry_type, amount_kobo, balance_after_kobo, reference, reason, meta
  ) values (
    p_user_id, 'debit', p_amount_kobo, v_new, p_reference, p_reason, coalesce(p_meta, '{}'::jsonb)
  );

  return v_new;
end;
$$;

create or replace function public.wallet_credit(
  p_user_id uuid,
  p_amount_kobo bigint,
  p_reference text,
  p_reason text,
  p_meta jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new bigint;
begin
  if p_amount_kobo is null or p_amount_kobo <= 0 then
    raise exception 'invalid_amount';
  end if;

  if p_reason = 'wallet_fund' and exists (
    select 1 from public.wallet_ledger
    where reference = p_reference and reason = 'wallet_fund' and entry_type = 'credit'
  ) then
    select balance_kobo into v_new from public.wallets where user_id = p_user_id;
    return coalesce(v_new, 0);
  end if;

  insert into public.profiles (id, email)
  values (p_user_id, null)
  on conflict (id) do nothing;
  insert into public.wallets (user_id, balance_kobo)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  update public.wallets
  set balance_kobo = balance_kobo + p_amount_kobo,
      updated_at = now()
  where user_id = p_user_id
  returning balance_kobo into v_new;

  insert into public.wallet_ledger (
    user_id, entry_type, amount_kobo, balance_after_kobo, reference, reason, meta
  ) values (
    p_user_id, 'credit', p_amount_kobo, v_new, p_reference, p_reason, coalesce(p_meta, '{}'::jsonb)
  );

  return v_new;
end;
$$;

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.bill_orders enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "wallets_select_own" on public.wallets;
create policy "wallets_select_own" on public.wallets for select using (auth.uid() = user_id);
drop policy if exists "ledger_select_own" on public.wallet_ledger;
create policy "ledger_select_own" on public.wallet_ledger for select using (auth.uid() = user_id);
drop policy if exists "orders_select_own" on public.bill_orders;
create policy "orders_select_own" on public.bill_orders for select using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.wallets to authenticated;
grant select on public.wallet_ledger to authenticated;
grant select on public.bill_orders to authenticated;
