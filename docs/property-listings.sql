-- Run in Supabase SQL editor for property CRM
create table if not exists public.property_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  deal_type text not null check (deal_type in ('rent', 'buy')),
  property_type text not null,
  location text not null,
  city text not null default '',
  state text not null default '',
  beds int not null default 0,
  baths int not null default 0,
  price_usd numeric not null default 0,
  price_ngn numeric,
  price_period text default 'total',
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  image_url text not null default '',
  video_url text,
  agent_name text not null default '',
  agent_phone text not null default '',
  agent_whatsapp text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  verified boolean not null default false,
  source text default 'agent-submit',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists property_listings_status_idx on public.property_listings (status);
create index if not exists property_listings_city_idx on public.property_listings (city);
