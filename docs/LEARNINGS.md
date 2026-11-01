# Learnings

Append three lines at the end of every session. Never rewrite earlier entries.

## Session 1 · 7 Sep
- What worked:
- What did not:
- What we change next week:

## Session 7 · 19 Oct
- What worked: replacing Supabase with a fake in the browser tests (tests/e2e/supabaseMock.ts) let all S1 sign-in tests run in CI without any keys. Hallway test A gave us seven concrete changes, merged the same week.
- What did not: the S1 branch grew to about 630 changed lines, over our 300-line limit, and it was started before the hallway-test PRs, so merging main gave a conflict in Prototype.tsx (both sides changed the React import).
- What we change next week: split a story into PRs under 300 lines, and merge main into a feature branch before opening its PR.

## Online meeting · 22 Oct
- What worked: moving the app to the start page was a small PR (7 files, about 65 changed lines). The browser tests only needed a new URL, because they all sign in through one helper (signUp in tests/e2e/supabaseMock.ts).
- What did not: we called S1 done, but a new visitor at the dev URL still saw the template page, because sign-in was only at /?prototype. We noticed only when we read acceptance criterion 1 again.
- What we change next week: before a card goes to Done, check every acceptance criterion on the dev URL itself, as a new visitor would open it.

## Agent session · 1 Nov
- What worked: extending the fake Supabase let us build and test saving attempts and the report link with no keys and no real accounts. A trial merge showed the new branch works together with `fix/leave-while-running` (29 of 29 browser tests) before either was merged.
- What did not: green tests here do not prove the database works, because the migration has still not been run on the real project. Checking the repository against the gates also showed that two finished branches had no PR, and that TESTPLAN.md claims an `agent-found` label that does not exist. The new work reached 434 changed lines before anyone counted, so it had to be split afterwards.
- What we change next week: open the PR the day a branch is finished, and check GitHub before writing that something is done. Count changed lines when a story is half done, not at the end. Run a migration on the real project before building on its tables.

## Database migration · 1 Nov
- What worked: running the migration by hand in the Supabase SQL Editor went well, so the tasks and attempts tables now exist on the real project.
- What did not: the migration waited after PR #37 was merged, because Aleksandr's Supabase account has no access to the project, and the branch that uses the tables was built before it ran.
- What we change next week: do the two-account check in the live app before the branch is merged, and give every teammate access to the Supabase project.
