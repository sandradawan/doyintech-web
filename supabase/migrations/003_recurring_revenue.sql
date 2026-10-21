-- DoyinTech recurring revenue: Paystack subscriptions + email list. Run after 002.
-- Server-only tables (RLS on, no anon/authenticated policies).

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  plan_id text not null,                         -- our id, e.g. 'pro-monthly', 'care-growth'
  plan_code text,                                -- Paystack PLN_xxx
  subscription_code text unique,                 -- Paystack SUB_xxx
  email_token text,                              -- needed to cancel / manage via API
  customer_code text,
  status text not null default 'active'
    check (status in ('active', 'non-renewing', 'attention', 'cancelled', 'completed')),
  amount_kobo bigint,
  next_payment_date timestamptz,
  last_payment_reference text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_email_idx on public.subscriptions (lower(email));
create index if not exists subscriptions_plan_status_idx on public.subscriptions (plan_id, status);
alter table public.subscriptions enable row level security;
revoke all on public.subscriptions from anon, authenticated;

-- Email list + automated nurture sequence (see /api/cron/nurture).
create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,
  referral text,
  step int not null default 0,                   -- last nurture email sent (0 = welcome only)
  next_send_at timestamptz,
  unsubscribe_token text not null default encode(gen_random_bytes(18), 'hex'),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists email_subscribers_due_idx
  on public.email_subscribers (next_send_at)
  where unsubscribed_at is null;
alter table public.email_subscribers enable row level security;
revoke all on public.email_subscribers from anon, authenticated;
