-- Students shown in the slideshow and e-magazine on /students.
-- Added and removed from /admin/student-magazine; the site reads them with the service role only.

create table if not exists public.student_spotlights (
  id bigint generated always as identity primary key,
  name text not null default '' check (char_length(name) <= 80),
  school text not null check (char_length(school) between 2 and 80),
  work text not null default '' check (char_length(work) <= 120),
  photo_url text not null,
  banner_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists student_spotlights_published_idx on public.student_spotlights (published, created_at desc);

alter table public.student_spotlights enable row level security;
revoke all on public.student_spotlights from anon, authenticated;

-- Public bucket for the photos (uploads go through /api/admin/student-spotlights only).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('students', 'students', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
