# JobBridge

When a junior developer job-seeker is applying for their first software development job but has no professional experience to prove their skills, so their CV is filtered out before anyone reviews their actual ability, JobBridge lets them complete a short, realistic coding task and get an AI-reviewed skill report they can attach to job applications, so that interview invitations per application go from [today, from the survey] to [target].

| | |
|---|---|
| Team | Daniel Ivanenko, Product · Aleksandr Gomžin, Delivery · Oleksandr Krutko, Quality |
| Dev URL | https://team-project-azure-pi.vercel.app |
| Board | https://github.com/users/GomeZko/projects/5/views/2 |
| Course | PR-520 Software Development Team Project, EEK, 2026/27 |

**First time here? Follow [docs/SETUP.md](docs/SETUP.md) step by step.**

## The idea

Junior developers in Estonia get stuck in the loop of "no experience → no job → no experience". Their CVs are often filtered out before anyone looks at what they can actually do.

**v1 scope:** only the job-seeker side. Employers see nothing except a report link or PDF that the student sends them.

## Run locally
```bash
npm install                     # once, and after anyone adds a package
npm run dev                     # open http://localhost:5173
npm test                        # unit tests
npx playwright install chromium # once, before the first browser test
npm run e2e                     # browser tests
npm run a11y                    # accessibility check (session 9)
```

## Milestones
Each milestone is one epic on the board. Details in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md).
1. 28.09 (session 4): the start page is live on the dev URL
2. 12.10 (session 6): the first story works on the dev URL
3. 19.10 (session 7): one user task has an automated test
4. 09.11 (session 10): v1 demo to the class
5. Before 23.11 (session 12): v2 with changes from client feedback

## Team

| Person | Role |
|---|---|
| Daniel Ivanenko | Product: client questions and requirements |
| Aleksandr Gomžin | Delivery: shared files, task board and publishing |
| Oleksandr Krutko | Quality: tests and checking the result |

Details in [Team-agreement.md](Team-agreement.md). How we use branches and pull requests: [CONTRIBUTING.md](CONTRIBUTING.md).

## Agent-ready
The product exposes one MCP tool in `mcp/server.ts`. Register it in your agent with `.vscode/mcp.json` (Copilot) or `.mcp.json` (Claude Code). Cline stores MCP servers per machine, so add it once in the Cline settings panel.

## Gates
Run the prompt in `docs/GATE-REPORT-PROMPT.md` with your agent before every Moodle submission. The output is `docs/GATE-REPORT.md`.
