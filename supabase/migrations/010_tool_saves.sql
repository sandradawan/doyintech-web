-- Cloud save for the free tools: one row per signed-in user per tool, holding the same JSON the
-- tool keeps in localStorage. Free for every signed-in user (the reason to create an account).
-- Run after 009. Reads and writes go through /api/tools/saved with the service role, scoped by
-- user_id; the RLS policy below also lets the owner read their own rows directly.

create table if not exists public.tool_saves (
  user_id uuid not null references auth.users (id) on delete cascade,
  tool text not null check (tool ~ '^[a-z0-9-]{2,60}$'),
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, tool)
);

create index if not exists tool_saves_user_updated_idx on public.tool_saves (user_id, updated_at desc);

alter table public.tool_saves enable row level security;

drop policy if exists "tool_saves_own_read" on public.tool_saves;
create policy "tool_saves_own_read" on public.tool_saves
  for select using (auth.uid() = user_id);

grant select on public.tool_saves to authenticated;
