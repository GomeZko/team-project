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
