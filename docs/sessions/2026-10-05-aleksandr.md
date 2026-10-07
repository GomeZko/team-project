# Agent session log · Aleksandr Gomžin · week of 5 Oct 2026

Agent: Claude Code (desktop app), model Claude Opus 5.5.

## What I asked
- Push our team-project folder to the existing GitHub repository.
- Go through all course gates on Moodle and tell me what is missing.
- Move the repository onto the course template, deploy it to Vercel, make the board and submit G3.
- Add my teammates to the board and check who has access to the repository.

## What I accepted
- Our repo was not made from the template. The agent copied the template app, CI, tests, `mcp/server.ts` and docs in with SETUP.md Part 2, Path B, and kept our own README, PRODUCT.md and Team-agreement.md (PR #1).
- Start page and smoke test show "JobBridge". Build, unit tests and the smoke test passed locally and in CI.
- `docs/REQUIREMENTS.md` added from our G2 draft; I submitted the link for G2 myself.
- Vercel project with dev URL https://team-project-azure-pi.vercel.app, added to README and AGENTS.md (PR #2).
- Public board with 5 epics (one per milestone) and stories S1–S8 as issues (PR #16 adds the link). Daniel and Oleksandr added to the board.
- The agent submitted the G3 links in Moodle after I asked it to.

## What I changed or rejected
- The agent created a separate git repo inside the project folder instead of using the git repo of my whole home folder, which points to another project. I agreed.
- The agent did not fill in the interview sections of PRODUCT.md, because we do not have the survey results yet. G1 waits for Daniel's data.
- I changed Daniel's and Oleksandr's board role from Write to Admin myself.
- The first PR was merged before CI finished because the repo has no branch rule. CI passed afterwards. We should add the rule in session 7.

## What I still need to understand
- How `.github/workflows/ci.yml` runs the tests on every pull request.
- What `mcp/server.ts` does and how we will connect `search_items` for G7.
