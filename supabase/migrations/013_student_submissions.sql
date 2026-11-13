-- Lets students send their own photo for the magazine. Their entry stays hidden until an admin approves it.
-- Run after 012_student_spotlights.sql.

alter table public.student_spotlights add column if not exists source text not null default 'admin';
alter table public.student_spotlights add column if not exists consent boolean not null default false;
alter table public.student_spotlights add column if not exists contact text not null default '' check (char_length(contact) <= 120);

create index if not exists student_spotlights_pending_idx on public.student_spotlights (published, source, created_at desc);
