# JobBridge — Requirements and Project Plan (G2)

> Draft for the "Requirements and project plan" gate (G2), scoped to the simplified, student-only version of JobBridge.
> Non-functional targets below are the course's fixed template targets — don't change them without talking to the instructor first.

## Functional requirements

- FR1: A visitor can register and sign in.
- FR2: A signed-in user can select a task category (e.g. "Junior Backend", "SQL", "Frontend").
- FR3: A user can view a task's description and any starter files before attempting it.
- FR4: A user can submit a solution to a task.
- FR5: The system automatically runs a hidden test suite against the submission and records pass/fail results.
- FR6: The system sends the submission (and test results) to an AI model for qualitative evaluation (code quality, structure, explanation of the solution).
- FR7: A user can view a combined report: automated test results + AI evaluation + an overall skill score.
- FR8: A user can generate a shareable link (or export a PDF) of their report to send to employers.
- FR9: A user can view their history of past attempts and scores.

## Non-functional requirements

| # | Requirement | Target | How we will check it |
|---|---|---|---|
| 1 | Performance | First screen usable within 2 seconds on the specified 4G test | Record device and method used (e.g. Chrome DevTools network throttling, specific phone model) |
| 2 | Accessibility | Main tasks (select task, submit solution, view report) work fully by keyboard; axe reports 0 serious issues | Record which pages/tasks were checked and when |
| 3 | Security | Row Level Security (RLS) enabled on every Supabase table; a test user cannot access another user's private records | Document the test: two test accounts, attempt cross-account read, confirm it's blocked |
| 4 | Privacy | 0 real personal-data fields in client records used for the app, prompts, or repository | Use fictional test users while building; list which fields exist (e.g. email for login) and why each is needed |
| 5 | Availability | Dev URL works during all class hours; same-day rollback after a failed deployment | Record dated checks; note that one successful visit does not prove continuous availability |

## User stories (Given / When / Then)

1. Given a new visitor, when they open the app, then they see a sign-up/sign-in screen.
2. Given a signed-in user, when they open the dashboard, then they see the available task categories.
3. Given a user on the dashboard, when they select a category (e.g. "SQL"), then they see that task's description and starter files.
4. Given a user viewing a task, when they submit a solution, then the system runs the hidden test suite and shows pass/fail results.
5. Given the automated tests have finished, when results are ready, then the AI evaluation step runs automatically.
6. Given the AI evaluation is complete, when the user opens their report, then they see test results, AI feedback, and an overall skill score.
7. Given a completed report, when the user clicks "Share", then they get a shareable link or PDF to send to an employer.
8. Given a signed-in user with past attempts, when they open "History", then they see a list of previous tasks and scores.

## Events (past tense, chronological order, with triggering command)

1. **UserRegistered** — triggered by `SignUp`
2. **TaskCategorySelected** — triggered by `SelectTaskCategory`
3. **TaskStarted** — triggered by `StartTask`
4. **SolutionSubmitted** — triggered by `SubmitSolution`
5. **TestsRun** — triggered by `RunTests` (system-triggered on submission)
6. **AIEvaluationCompleted** — triggered by `RequestAIEvaluation` (system-triggered after tests run)
7. **ReportGenerated** — triggered by `GenerateReport`
8. **ReportShared** — triggered by `ShareReport`

## Milestones (fixed by the course)

- **Session 4:** a deployed hello page.
- **Session 6:** first story live — task category selection + viewing a task description.
- **Session 7:** core stories tested — solution submission + automated test run, with Playwright tests for the stories above.
- **Session 10:** the v1 demo.
- **Session 11–12:** v2 work, completed before session 12.
