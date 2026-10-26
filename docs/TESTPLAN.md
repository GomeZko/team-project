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
Agent: Claude Code with Playwright MCP (`.mcp.json`), 26.10.2026, against `npm run dev` with a fake Supabase in the browser (like tests/e2e/supabaseMock.ts).

Prompt used:
> Sign up as a job-seeker and go through the main flow: pick a task, submit a solution, open the report and History. Try what a real user might do: a phone screen (320 and 375 px wide), leaving a screen while it is busy. Report every bug with the steps to repeat it.

Bugs found:
| # | Bug | How to repeat | Status |
|---|---|---|---|
| 1 | On a phone the top bar is wider than the screen: the page scrolls sideways and **Sign out** is off-screen. The History table also pushed the page wider. | Window 375 px wide, sign in: the page is 468 px wide. | Fixed in branch `fix/phone-layout` (PR labelled `agent-found`). Test: "on a phone the page does not scroll sideways and Sign out is visible" in tests/e2e/prototype.spec.ts |
| 2 | Leaving a task while "Running tests…" shows does not cancel it: about 1 second later the report replaces the screen you moved to. | Submit a solution, click History right away. | Fixed in branch `fix/leave-while-running` (PR labelled `agent-found`). Test: "leaving a task while its tests run keeps you on the screen you chose" in tests/e2e/prototype.spec.ts |
