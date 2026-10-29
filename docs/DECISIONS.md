# Decisions

Append one entry per decision that changes the stack, the scope or the process.

## 2026-09-28 · Stack
Kept the template default (Vite, React, TypeScript, Supabase, Vercel). Reason: deploys in one session, no card needed.

## 2026-10-05 · Moved onto the course template
Our repository was not made from the template, so we copied the template app, CI and docs in (SETUP.md Part 2, Path B). Our own README, PRODUCT.md, REQUIREMENTS.md and Team-agreement.md stay. No database yet: no story needs to save data so far.

## 2026-10-05 · Hosting
Vercel (Hobby) deploys main to https://team-project-azure-pi.vercel.app on every merge. Project: gomezko/team-project.

## 2026-10-19 · Supabase for accounts (S1)
Story S1 / FR1 needs real accounts, so we added Supabase Auth (email + password, "Confirm email" off so sign-up works at once for demos and tests). Teacher agreed. The name and the role (job-seeker or task author) are saved with the account in Supabase's built-in `user_metadata`, so there is no table of our own yet and nothing to protect with RLS yet. Attempts and tasks stay in the browser until a story saves them; that story adds tables with RLS. Browser tests replace Supabase with a fake (tests/e2e/supabaseMock.ts), so CI needs no keys. Project region: EU. Keys: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (the publishable key) in .env and in Vercel; the secret key is never used in the app.

## 2026-10-27 · Supabase tables for tasks and attempts (FR8, FR9)
Attempts and author tasks lived only in one browser, so a person lost their history on another device, authors' tasks were invisible to others, and a report link could not open for an employer. We add two tables in `supabase/migrations/20261027_tasks_attempts.sql`: `tasks` (only tasks published by authors; built-in tasks stay in code) and `attempts`. RLS is on for both: a person reads only their own attempts, everyone signed in reads tasks, only an author adds tasks. Visitors without an account get no table rights; an employer opens one shared report through the function `open_shared_report`, which returns no user id or email and counts the view. Authors see numbers for their own tasks through `my_task_stats`, without names. Nobody can delete rows from the app yet. Known limits for the prototype: the score is still computed in the browser, so a person could save a fake score; and the role comes from `user_metadata`, which a user can change. Both move to the server with the real test runner. The migration is run by hand in the Supabase SQL Editor; the app starts using the tables in the next PR.
