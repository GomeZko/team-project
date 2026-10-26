# Agent session log · Oleksandr Krutko · week of 19 Oct 2026

Agent: Claude Code (VS Code extension), model Claude Opus 5.5.

## What I asked
- Replace the demo sign-in in the prototype with real accounts for story S1.
- Merge the hallway test A changes from main into my branch and fix the conflict.
- Write down what we learned in session 7 and in the online meeting on 22 Oct.
- Make the dev URL open on the sign-in screen instead of the course template page.

## What I accepted
- Supabase Auth with email and password (PR #30). The name and role (job-seeker or task author) are saved with the account, the session survives a reload and Sign out really signs out. Clear errors for a bad form, a wrong password and an email that is already registered.
- Attempts are kept per account in the browser, so two accounts on one laptop do not mix.
- Browser tests use a fake Supabase (`tests/e2e/supabaseMock.ts`), so CI needs no keys. Unit tests in `src/lib/auth.test.ts`.
- The decision is written in DECISIONS.md: no own table yet, so no RLS yet; only the publishable key is used in the app. UX.md and TESTPLAN.md updated.
- Merge conflict in `src/prototype/Prototype.tsx`: both sides changed the React import. The agent kept both (useEffect/useRef for sign-in, KeyboardEvent for Tab in the code box).
- The app now opens on the start page `/` (PR #31). Old `/?prototype` links still work, and the smoke test checks the Sign in heading.
- Learnings for session 7 and the 22 Oct meeting added to LEARNINGS.md.

## What I changed or rejected
- PR #30 grew to about 630 changed lines, over our 300-line limit. I kept it as one PR this time and we wrote down to split stories next week.
- We called S1 done, but a new visitor still saw the template page. I asked for the start-page fix after re-reading acceptance criterion 1.

## What I still need to understand
- How `tests/e2e/supabaseMock.ts` replaces Supabase inside the browser tests.
- What RLS is and what we must protect once a story adds our own tables.
