-- DoyinTech gift cards: closed-loop store credit, spendable only on DoyinTech's own products,
-- tools and services. Run after 008.
--
-- Money movements are rows in gift_card_holds, never an editable balance:
--   balance = initial_kobo − captured holds − active (unexpired) holds.
-- All balance changes go through the functions below, which lock the card row so two checkouts
-- can never spend the same naira.

create table if not exists public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,            -- HMAC of the code; the plain code is never stored
  code_enc text not null,                    -- AES-GCM encrypted code, so the buyer can see/resend it
  code_last4 text not null,
  initial_kobo bigint not null check (initial_kobo between 100000 and 50000000),
  status text not null default 'pending' check (status in ('pending', 'active', 'disabled')),
  design text not null default 'classic',
  purchaser_email text not null,
  purchaser_name text,
  recipient_name text,
  recipient_email text,
  message text,
  paystack_reference text unique,
  activated_at timestamptz,
  delivered_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists gift_cards_purchaser_idx on public.gift_cards (lower(purchaser_email));

create table if not exists public.gift_card_holds (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.gift_cards (id) on delete restrict,
  reference text not null unique,            -- checkout reference (DT_… with Paystack, GC_… card-only)
  amount_kobo bigint not null check (amount_kobo > 0),
  product_id text not null,
  email text,
  status text not null default 'held' check (status in ('held', 'captured', 'released')),
  expires_at timestamptz not null,
  captured_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists gift_card_holds_card_idx on public.gift_card_holds (card_id, status);

alter table public.gift_cards enable row level security;
alter table public.gift_card_holds enable row level security;
revoke all on public.gift_cards, public.gift_card_holds from anon, authenticated;

-- Spendable balance right now (excludes expired holds).
create or replace function public.gift_card_available(p_card uuid)
returns bigint language sql stable as $$
  select c.initial_kobo
    - coalesce((select sum(h.amount_kobo) from public.gift_card_holds h
                where h.card_id = c.id
                  and (h.status = 'captured' or (h.status = 'held' and h.expires_at > now()))), 0)
  from public.gift_cards c where c.id = p_card;
$$;

-- Reserve up to p_max kobo for a checkout. Returns the amount actually held (0 if none).
create or replace function public.gift_card_hold(
  p_code_hash text, p_reference text, p_max bigint, p_product text, p_email text, p_minutes int
) returns bigint language plpgsql as $$
declare
  v_card public.gift_cards%rowtype;
  v_amount bigint;
begin
  select * into v_card from public.gift_cards where code_hash = p_code_hash for update;
  if not found or v_card.status <> 'active' or (v_card.expires_at is not null and v_card.expires_at < now()) then
    return 0;
  end if;
  v_amount := least(p_max, public.gift_card_available(v_card.id));
  if v_amount <= 0 then return 0; end if;
  insert into public.gift_card_holds (card_id, reference, amount_kobo, product_id, email, expires_at)
  values (v_card.id, p_reference, v_amount, p_product, p_email, now() + make_interval(mins => p_minutes));
  return v_amount;
end;
$$;

-- Turn a hold into a spend. Idempotent. A hold that expired or was released is re-captured
-- only if the card still has the money; otherwise returns false and the purchase is refused.
create or replace function public.gift_card_capture(p_reference text)
returns boolean language plpgsql as $$
declare
  v_hold public.gift_card_holds%rowtype;
begin
  select * into v_hold from public.gift_card_holds where reference = p_reference;
  if not found then return false; end if;
  if v_hold.status = 'captured' then return true; end if;
  perform 1 from public.gift_cards where id = v_hold.card_id for update;
  if v_hold.status = 'held' and v_hold.expires_at > now() then
    update public.gift_card_holds set status = 'captured', captured_at = now() where id = v_hold.id;
    return true;
  end if;
  if public.gift_card_available(v_hold.card_id) >= v_hold.amount_kobo then
    update public.gift_card_holds set status = 'captured', captured_at = now() where id = v_hold.id;
    return true;
  end if;
  return false;
end;
$$;

revoke all on function public.gift_card_available(uuid), public.gift_card_hold(text, text, bigint, text, text, int),
  public.gift_card_capture(text) from public, anon, authenticated;
grant execute on function public.gift_card_available(uuid), public.gift_card_hold(text, text, bigint, text, text, int),
  public.gift_card_capture(text) to service_role;
