# Test plan

## What we test
Core stories for G6: S2, S3, S4 (plus S1). All tests run on every pull request and on main.

| Story | End-to-end tests | Unit tests | Status |
|---|---|---|---|
| S1 sign up, sign in, sign out | tests/e2e/auth.spec.ts (12 tests, Supabase replaced by tests/e2e/supabaseMock.ts), tests/e2e/smoke.spec.ts | src/lib/auth.test.ts | passed in CI |
| S2 see task categories | tests/e2e/prototype.spec.ts: "a job-seeker submits a SQL solution and the report shows on the dashboard", "error and empty states: starter code only, category without tasks" | none: no separate logic | passed in CI |
| S3 open a task | tests/e2e/prototype.spec.ts: "the task shows its checks, and Tab adds spaces in the code box", "a failed check shows a tip, and sharing shows a badge" (examples) | none: no separate logic | passed in CI |
| S4 submit a solution, see pass/fail | tests/e2e/prototype.spec.ts: "a job-seeker submits a SQL solution…", "Java tasks pass with or without spaces around operators", "Python tasks give a score", "error and empty states…" | src/prototype/data.test.ts (runChecks: demo solutions pass, weak solutions fail) | passed in CI |
| S6 view the report | tests/e2e/prototype.spec.ts: "a failed check shows a tip, and sharing shows a badge" | src/prototype/data.test.ts | passed in CI (prototype, no real AI) |
| S7 share the report | tests/e2e/prototype.spec.ts: "a failed check shows a tip, and sharing shows a badge" | none | passed in CI (prototype, sample link) |
| S8 history | tests/e2e/prototype.spec.ts: "history lists every attempt and opens its report"; tests/e2e/auth.spec.ts: "each account sees only its own attempts" | none | passed in CI |
| Task author adds a task | tests/e2e/prototype.spec.ts: "a task author publishes a task and a job-seeker can solve it" | none | passed in CI |
| S5 AI evaluation | none yet | none | todo |

Evidence for G6:
- Green CI run on main: https://github.com/GomeZko/team-project/actions/runs/40023442102 (commit 3f8ebb9, 26.10.2026)
- Tests folder: https://github.com/GomeZko/team-project/tree/main/tests/e2e

## How we run it
- Locally: `npx playwright test` against the dev server
- On every pull request: GitHub Actions, see .github/workflows/ci.yml
- Against the deployed dev URL: `BASE_URL=https://... npx playwright test`

## What the agent may not skip
A story is done only when its end-to-end test is green in CI.

## Agent-driven bug hunt (session 8)
Prompt used, bugs found, PR links.
