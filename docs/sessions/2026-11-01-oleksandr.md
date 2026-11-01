# Agent session log · Oleksandr Krutko · 1 Nov 2026

Agent: Claude Code (VS Code extension), model Claude Opus 5.5.

This is a second log for the week of 26 Oct. The first one, `2026-10-26-oleksandr.md`, is still on the unmerged branch `fix/leave-while-running`.

## What I asked
- Say which tasks are left in the project.
- Recommend what to implement now.
- Implement it in a new branch.
- Write this log and the learnings.

## What I accepted
- The status check against the gates: G2, G3 and G6 pass, G1 passes with follow-ups, and G4, G5, G7, G8, G9 and G10 still have work left.
- The recommendation to connect the app to the database next, because the report link is what the product promises and the tables from PR #37 already exist. The real AI review (S5) waits until after the 9 Nov demo.
- Two commits on `feat/db-attempts-report-link`, not pushed yet:
  - `18923c6` (FR9): attempts are saved in the `attempts` table instead of `localStorage`. The screen says so if attempts cannot load, and if saving fails the person keeps their solution.
  - `628741d` (FR8): "Share report" gives a real link, `/?report=<id>`, that opens without an account and shows no name or email. A report that is not shared does not open.
- The fake Supabase in `tests/e2e/supabaseMock.ts` now also answers for the attempts table and `open_shared_report`, so CI still needs no keys. New tests are in `tests/e2e/attempts.spec.ts`.

## What I changed or rejected
- I did not reject anything the agent proposed in this session.
- The status check found a mistake in our docs: TESTPLAN.md says PR #33 has the `agent-found` label, but no PR has it and the label does not exist yet. I still need to add it for G7.
- The agent corrected its own work along the way:
  - The first version was 434 changed lines, over our 300-line limit, so it was split into two commits of 236 and 202 lines, one for each PR.
  - The first test for a failed save never submitted again, so it was rewritten to do that.
  - Two new tests failed because the test's solution was wrong, not the app. The solution used `GROUP BY x`, but the check needs `customer_id`.
  - While splitting the work, its backup step failed and it had to write the report link part again. Nothing of ours was lost, and all tests were run again afterwards.

## What is not checked yet
- The new code has only run against the fake Supabase. The migration has not been run on the real project, so saving and sharing are not tested for real, and the branch must not be deployed before the migration runs.
- The two-account check in the live app (non-functional requirement 3) is still to do.
- Known limits: a person can still fake a score, which now shows on a public page; the app has no button to stop sharing; tasks added by authors still stay in one browser.

## What I still need to understand
- Why the attempts are loaded in a separate `useEffect` and not inside `onAuthStateChange`.
- How Row Level Security decides whose attempts come back when the code has no filter by user.
- How to check the score on the server, so that a shared report can be trusted.
