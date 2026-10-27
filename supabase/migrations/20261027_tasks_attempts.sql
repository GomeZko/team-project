-- JobBridge tables for tasks and attempts (FR8, FR9), see docs/DECISIONS.md 2026-10-27.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste this file > Run.
-- Every table has Row Level Security (non-functional requirement 3).

-- Tasks published by task authors. The built-in tasks stay in src/prototype/data.ts.
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users on delete cascade,
  author_name text not null,
  category text not null check (category in ('sql', 'frontend', 'java', 'python', 'backend')),
  title text not null check (length(title) between 1 and 120),
  minutes int not null check (minutes between 5 and 60),
  description text not null check (length(description) between 1 and 2000),
  starter text not null default '',
  examples jsonb not null default '[]',
  checks jsonb not null check (jsonb_typeof(checks) = 'array' and jsonb_array_length(checks) > 0),
  created_at timestamptz not null default now()
);

-- One row per submitted solution. task_id is a built-in id like 'sql-top-customers' or a tasks.id.
create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  task_id text not null,
  task_title text not null,
  results jsonb not null,
  score int not null check (score between 0 and 100),
  is_public boolean not null default false,
  views int not null default 0,
  created_at timestamptz not null default now()
);
create index attempts_user_id_idx on public.attempts (user_id, created_at desc);
create index attempts_task_id_idx on public.attempts (task_id);

alter table public.tasks enable row level security;
alter table public.attempts enable row level security;

-- Only signed-in people get table rights, and only the columns they need.
-- A person cannot set views or is_public when saving an attempt, and can change only is_public later.
revoke all on public.tasks, public.attempts from anon, authenticated;
grant select on public.tasks to authenticated;
grant insert (author_name, category, title, minutes, description, starter, examples, checks) on public.tasks to authenticated;
grant update (title, minutes, description, starter, examples, checks) on public.tasks to authenticated;
grant select on public.attempts to authenticated;
grant insert (task_id, task_title, results, score) on public.attempts to authenticated;
grant update (is_public) on public.attempts to authenticated;

-- Tasks: everyone signed in reads them; only a task author adds them; only the author changes their own.
-- Nobody can delete rows from the app yet; deleting the account removes its rows.
-- The role comes from the account (user_metadata), the same place the app reads it.
create policy "signed-in people read tasks" on public.tasks
  for select to authenticated using (true);
create policy "authors add their own tasks" on public.tasks
  for insert to authenticated
  with check (author_id = auth.uid() and auth.jwt() -> 'user_metadata' ->> 'role' = 'author');
create policy "authors change their own tasks" on public.tasks
  for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());

-- Attempts: a person sees and changes only their own.
create policy "people read their own attempts" on public.attempts
  for select to authenticated using (user_id = auth.uid());
create policy "people save their own attempts" on public.attempts
  for insert to authenticated with check (user_id = auth.uid());
create policy "people share their own attempts" on public.attempts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- A shared report, opened by anyone with the link (an employer has no account).
-- It returns one public attempt without the owner's id or email, and counts the view.
create function public.open_shared_report(report_id uuid)
returns table (task_title text, results jsonb, score int, created_at timestamptz)
language sql security definer set search_path = '' as $$
  update public.attempts a set views = a.views + 1
  where a.id = report_id and a.is_public
  returning a.task_title, a.results, a.score, a.created_at;
$$;
revoke all on function public.open_shared_report(uuid) from public, anon, authenticated;
grant execute on function public.open_shared_report(uuid) to anon, authenticated;

-- Numbers for the task author's dashboard: attempts, people and average score per own task, no names.
create function public.my_task_stats()
returns table (task_id uuid, attempts bigint, people bigint, average_score int)
language sql stable security definer set search_path = '' as $$
  select t.id, count(a.id), count(distinct a.user_id), round(avg(a.score))::int
  from public.tasks t
  left join public.attempts a on a.task_id = t.id::text
  where t.author_id = auth.uid()
  group by t.id;
$$;
revoke all on function public.my_task_stats() from public, anon, authenticated;
grant execute on function public.my_task_stats() to authenticated;
