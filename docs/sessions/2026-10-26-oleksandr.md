# Agent session log · Oleksandr Krutko · week of 26 Oct 2026

Agent: Claude Code (VS Code extension), model Claude Opus 5.5.

## What I asked
- Look at the gates and say what is left for me, now that a teammate did G6.
- Complete G7: find a bug with Playwright MCP, fix it with a test, and make the MCP tool `search_items` real.
- Fix the second bug the agent found, and write this log.

## What I accepted
- The agent ran the app with a fake Supabase inside the Playwright MCP browser, so no real accounts were needed. It found two bugs, both written down in TESTPLAN.md with the prompt it used:
  1. On a phone (375 px) the top bar was wider than the screen: the page scrolled sideways and Sign out was off-screen. Fix: the top bar wraps, and the History table scrolls inside its own box. Branch `fix/phone-layout`.
  2. Leaving a task while "Running tests…" showed still opened the report about one second later. Fix: the timer is cancelled when the task screen closes. Branch `fix/leave-while-running`.
- Each fix has a browser test that failed before the fix and passes after it.
- `search_items` now finds coding tasks by category, title or description (`searchTasks` in src/prototype/data.ts, with unit tests). README lists both MCP tools. Branch `feat/mcp-search-tasks`.
- The agent checked the MCP tool by starting the real server and calling it: "sql" finds the SQL task, "kotlin" finds nothing.
- `.playwright-mcp/` (MCP screenshots and logs) is now in .gitignore.

## What I changed or rejected
- The first phone fix only made the top bar wrap. The new test still failed on History: the hidden "Report" column label is `position: absolute`, so it escaped the table's scroll box. Adding `position: relative` to the box fixed it. Writing the test first caught this.
- Screenshots from the MCP browser were committed by mistake on the MCP branch, because the .gitignore line was only on the other branch. They were removed in a second commit.
- The agent cannot open pull requests here (no `gh`), so I open the PRs and add the `agent-found` label myself.

## What I still need to understand
- Why `position: absolute` inside a scroll box can still make the whole page wider.
- How `useEffect` cleanup runs when React removes a screen, and why it stops the timer.
