# Test plan

## What we test
| Story | End-to-end test file | Unit tests | Status |
|---|---|---|---|
| S1 sign up, sign in, sign out | tests/e2e/auth.spec.ts, tests/e2e/smoke.spec.ts (Supabase replaced by tests/e2e/supabaseMock.ts) | src/lib/auth.test.ts | done |
| S2–S4, S6–S8 in the prototype | tests/e2e/prototype.spec.ts | src/lib/databaseStatus.test.ts | prototype |

## How we run it
- Locally: `npx playwright test` against the dev server
- On every pull request: GitHub Actions, see .github/workflows/ci.yml
- Against the deployed dev URL: `BASE_URL=https://... npx playwright test`

## What the agent may not skip
A story is done only when its end-to-end test is green in CI.

## Agent-driven bug hunt (session 8)
Prompt used, bugs found, PR links.
