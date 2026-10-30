# Agent session log · Aleksandr Gomžin · week of 26 Oct 2026

Agent: Claude Code (desktop app), model Claude Opus 5.5.

## What I asked
- Do G6: mark the status of every story with its PR and fill in the test plan.
- Check what Daniel pushed, then review and merge his interview notes (PR #34).
- Update PRODUCT.md with what the two interviews showed.
- Review and merge Oleksandr's phone layout fix (PR #33).
- Tell me what is left before the 2 November deadline.
- Show me a clickable mock-up of a platform that keeps data in a database, then make it easier to use and add a dashboard.
- Move it into the project, starting with the database tables (PR #37), and add Oleksandr as reviewer.
- Check whether the tables are live in our Supabase project.

## What I accepted
- REQUIREMENTS.md has a status line with PR links for each story, and TESTPLAN.md maps every story to its test and links CI (PR #32, merged by Oleksandr).
- PR #34 approved: no names or Discord handles, plan deviations and weak numbers are marked. In the review I asked Daniel to get written consent for the quotes and to book the 3–8.11 product test.
- PRODUCT.md (PR #35): both interviews added as evidence, support/Linux/DevOps juniors marked as not our client in v1, red-team notes 1–4 extended and two new ones: a pass/fail check does not show how someone thinks, and competitors such as HackerRank may already give certificates.
- PR #33 approved and merged: the top bar wraps on a phone and a 320 px test checks it.
- The mock-up (kept outside the repo): a dashboard for job-seekers with next step, scores per skill and report views, a dashboard for task authors, and a report an employer opens by link.
- PR #37: two tables, `tasks` and `attempts`, with Row Level Security. A person reads only their own attempts, only task authors add tasks, a visitor without an account sees a report only after it is shared. A unit test fails if a table has no RLS, and a check on a local Postgres (`supabase/tests/rls_check.sql`) passed all 13 steps. The reasons and known limits are in DECISIONS.md.

## What I changed or rejected
- Interview quotes stay out of PRODUCT.md; it uses our own words until the interviewees confirm consent in writing.
- "HackerRank gives skill certificates" is only our guess, so it is marked "to check" and not written as a fact.
- Oleksandr is doing G7, so I asked the agent not to touch his MCP branch.
- The agent first gave the tables delete rights. I kept them out: no story needs deleting yet, and AGENTS.md asks for a human check on anything that deletes data.
- A "hardest check" column on the author dashboard showed made-up numbers, so we removed it from the mock-up.
- PR #37 is merged, but the migration is not run yet: my Supabase account has no access to the project, so the agent did not run it. Oleksandr runs it or invites me.

## What I still need to understand
- How we answer the biggest new risk: HR may ignore a skill report. We need to talk to someone who hires juniors.
- How the AI review (S5) could comment on the approach, not only on the final code.
- The score is still computed in the browser, so a person could fake it. How to check it on the server.
