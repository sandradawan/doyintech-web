-- Conversion tracking + follow-up sequences. Run after 004.

-- Every conversion that matters: WhatsApp clicks, leads, sign-ups, checkouts, payments, new shops.
-- No personal data: path, label, amount and (with analytics consent) a random session id + UTM.
create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  name text not null,
  label text,
  path text,
  value_kobo bigint,
  session_id text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer_host text,
  created_at timestamptz not null default now()
);
create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_name_idx on public.site_events (name, created_at desc);
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;

-- Which follow-up sequence a subscriber is on (general | tools | lead | store), and when they paid.
alter table public.email_subscribers add column if not exists sequence text not null default 'general';
alter table public.email_subscribers add column if not exists converted_at timestamptz;
