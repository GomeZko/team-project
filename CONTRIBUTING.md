# How we work in this repository

## Branches

- `main` always contains working, reviewed work.
- Create a branch for every task: `feature/<short-name>`, `docs/<short-name>` or `fix/<short-name>`.

## Workflow

1. Take a task from the issues (or create one) and assign yourself.
2. Create a branch from `main`.
3. Make small commits with clear messages, e.g. `docs: add interview 01 notes`.
4. Open a pull request and link the issue (`Closes #12`).
5. At least one teammate reviews the PR before it is merged.

## Commit message prefixes

| Prefix | Use for |
|---|---|
| `feat:` | New functionality |
| `fix:` | Bug fixes |
| `docs:` | Documentation, interview and meeting notes |
| `test:` | Tests |
| `chore:` | Setup, config, cleanup |

## Privacy

Never commit real names or contact details of interviewees, passwords, API keys or `.env` files.
