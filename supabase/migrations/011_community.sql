-- Community board: questions, replies and reports. Run after 010.
-- Nothing is public until an admin approves it at /admin/community. All reads and writes go through
-- the API with the service role, so RLS is on with no policies: the browser can't reach these tables.

create table if not exists public.community_posts (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  display_name text not null check (char_length(display_name) between 2 and 40),
  topic text not null,
  title text not null check (char_length(title) between 10 and 140),
  body text not null check (char_length(body) between 20 and 4000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reply_count integer not null default 0,
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.community_replies (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.community_posts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  display_name text not null check (char_length(display_name) between 2 and 40),
  body text not null check (char_length(body) between 5 and 2000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

create table if not exists public.community_reports (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('post', 'reply')),
  item_id bigint not null,
  reason text not null check (char_length(reason) between 3 and 300),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists community_posts_status_idx on public.community_posts (status, approved_at desc);
create index if not exists community_posts_user_idx on public.community_posts (user_id, created_at desc);
create index if not exists community_replies_post_idx on public.community_replies (post_id, status, created_at);
create index if not exists community_replies_user_idx on public.community_replies (user_id, created_at desc);
create index if not exists community_reports_open_idx on public.community_reports (resolved, created_at desc);

alter table public.community_posts enable row level security;
alter table public.community_replies enable row level security;
alter table public.community_reports enable row level security;

-- Starter questions from the team, so the first visitors have something to answer.
insert into public.community_posts (display_name, topic, title, body, status, approved_at)
select 'DoyinTech team', v.topic, v.title, v.body, 'approved', now()
from (values
  ('Business', 'What is the hardest part of getting customers online?', 'Tell us what you sell and what has been hardest so far: being found, getting trusted, or getting paid. Others here may have solved the same problem.'),
  ('Websites & tech', 'Which free tool should we build next?', 'We keep adding free calculators and generators. Which tool would save you time every week? Describe the job you want it to do.'),
  ('General', 'Which podcast should we add to DoyinTech Listen?', 'Share a show you enjoy and say why other people would like it. Family-friendly shows only, please.')
) as v (topic, title, body)
where not exists (select 1 from public.community_posts);
