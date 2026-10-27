-- Check of Row Level Security (non-functional requirement 3) on a local, throwaway Postgres.
-- Run after supabase_stub.sql and the migration; see docs/TESTPLAN.md "Database access rules".
-- Users are fictional: Anna and Bob are job-seekers, Mark is a task author.
\set QUIET on
\set A '11111111-1111-1111-1111-111111111111'
\set B '22222222-2222-2222-2222-222222222222'
\set M '33333333-3333-3333-3333-333333333333'
-- Act as a signed-in person, the way Supabase passes the account to Postgres.
create function pg_temp.act(uid text, role text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', uid, false);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'user_metadata', json_build_object('role', role))::text, false);
end $$;

\echo '1. Anna saves an attempt: allowed, not public, 0 views'
select pg_temp.act(:'A', 'seeker') \g /dev/null
set role authenticated;
insert into public.attempts (task_id, task_title, results, score) values ('java-sum', 'Sum of two numbers', '[]', 100)
  returning id as rid, is_public, views \gset
select :'is_public' as is_public, :'views' as views;
\echo '2. Anna saves an attempt with views = 50: must fail'
insert into public.attempts (task_id, task_title, results, score, views) values ('java-sum', 'Sum', '[]', 100, 50);
\echo '3. Anna saves an attempt in Bob''s name: must fail'
insert into public.attempts (user_id, task_id, task_title, results, score) values (:'B', 'java-sum', 'Sum', '[]', 100);
\echo '4. Anna changes her own view count: must fail'
update public.attempts set views = 999;
reset role;

\echo '5. Bob reads all attempts: must see 0'
select pg_temp.act(:'B', 'seeker') \g /dev/null
set role authenticated;
select count(*) as bob_sees from public.attempts;
\echo '6. Bob shares Anna''s attempt: must change 0 rows'
with changed as (update public.attempts set is_public = true returning 1) select count(*) as changed from changed;
\echo '7. Bob publishes a task as a job-seeker: must fail'
insert into public.tasks (author_name, category, title, minutes, description, checks) values ('Bob', 'sql', 'X', 10, 'd', '[["a", "b"]]');
reset role;

\echo '8. Mark publishes a task as an author: allowed'
select pg_temp.act(:'M', 'author') \g /dev/null
set role authenticated;
insert into public.tasks (author_name, category, title, minutes, description, checks)
  values ('Mark', 'sql', 'Users without orders', 15, 'd', '[["Uses a LEFT JOIN", "left join"]]') returning title;
reset role;

\echo '9. Bob sees Mark''s task, tries it, and cannot change it'
select pg_temp.act(:'B', 'seeker') \g /dev/null
set role authenticated;
select title as bob_sees_task from public.tasks;
insert into public.attempts (task_id, task_title, results, score) select id::text, title, '[]', 50 from public.tasks;
with changed as (update public.tasks set title = 'changed by Bob' returning 1) select count(*) as changed from changed;
reset role;

\echo '10. Mark sees numbers for his task, no names: 1 attempt, 1 person, 50'
select pg_temp.act(:'M', 'author') \g /dev/null
set role authenticated;
select attempts, people, average_score from public.my_task_stats();
reset role;

\echo '11. A visitor without an account reads attempts: must fail'
select pg_temp.act('', '') \g /dev/null
set role anon;
select count(*) from public.attempts;
\echo '12. A visitor opens Anna''s report before she shares it: must return 0 rows'
select count(*) as rows_returned from public.open_shared_report(:'rid');
reset role;

\echo '13. Anna shares it; a visitor opens it twice: returns the report, views = 2'
select pg_temp.act(:'A', 'seeker') \g /dev/null
set role authenticated;
update public.attempts set is_public = true where id = :'rid';
reset role;
select pg_temp.act('', '') \g /dev/null
set role anon;
select task_title, score from public.open_shared_report(:'rid');
select count(*) from public.open_shared_report(:'rid') \g /dev/null
reset role;
select views from public.attempts where id = :'rid';
