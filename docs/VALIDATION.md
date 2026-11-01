# Validation

## Usability test with the client (session 9)
Participant role, date, three tasks, outcome per task, three quotes, three changes.

## Non-functional report
Checked on 1 Nov 2026 against main at commit `19e77e7`. Targets are the non-functional requirements in docs/REQUIREMENTS.md.

| Check | Tool | Result | Fix |
|---|---|---|---|
| Performance | Lighthouse 12.8, mobile with its default slow 4G throttling, live dev URL | Performance 99. First and largest content shown after 1.5 s, no blocking time, no layout shift. Meets the 2-second target. | None needed. |
| Accessibility | axe (@axe-core/playwright), `npm run a11y`, WCAG 2 A and AA rules | 0 serious or critical problems on 8 screens: sign-in, dashboard, categories, task list, task, report, history, and the task author's dashboard and add-task form. | The check covered only the sign-in page before; `tests/a11y/axe.spec.ts` now opens every screen. |
| Accessibility (keyboard) | Playwright, `tests/e2e/keyboard.spec.ts` | Pick a task, write a solution, submit and read the report with Tab, typing and Enter only. Tab types spaces in the code box; Esc, then Tab, leaves it, and the hint under the box says so. | New test, runs in CI. |
| Accessibility, best practices, SEO | Lighthouse, mobile, live dev URL | Accessibility 100, Best practices 100, SEO 90: the page had no meta description. | Added a meta description to `index.html`. |
| Dependencies | `npm audit` | 0 problems in the packages the app ships (`npm audit --omit=dev`). 1 moderate problem in `@hono/node-server`, which only the MCP server for agents uses (`mcp/server.ts`), not the website. | `npm audit fix` updates it; we will do it in its own PR and run the MCP server again. |
| Data protection | Supabase RLS review | Both tables (`tasks`, `attempts`) have Row Level Security; visitors without an account get no table rights. A 13-step check on a local Postgres passed, including that one account cannot read or change another's attempts (see TESTPLAN.md). | The migration is not run on the live project yet, so the live two-account check is still to do. |
| Privacy | Review of the code and the Supabase account fields | The app keeps only email (to sign in), name (shown on the dashboard) and role (job-seeker or task author). Shared reports show no name or email. Interview notes in the repo use no names or Discord handles. Test accounts are fictional. | None needed. |
| Availability | Visits to the dev URL and the Supabase address | The dev URL loads. On 1 Nov the Supabase address did not resolve, so sign-in did not work: the free project had most likely paused, because the keep-alive workflow has no secrets and did nothing. | Restore the project, then add `SUPABASE_URL` and `SUPABASE_ANON_KEY` as repository secrets so `.github/workflows/keep-alive.yml` keeps it awake. |
