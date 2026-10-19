# UX specification

Written in words so an agent can build a prototype in one pass and a tester can follow it.

v1 covers the job-seeker only (see PRODUCT.md). Core stories: S2 choose a category, S3 open a task, S4 submit a solution and see test results. The report and sharing (S6, S7) are shown in the prototype with sample data. Sign-in (S1), the real AI review (S5) and history (S8) are not in the prototype.

## Screens

### 1. Choose a skill (categories)
- Purpose: pick which skill to prove.
- First thing seen: heading "Choose a skill to prove" and one card per category with its number of tasks.
- Primary action: select a category card.
- Secondary actions: none.
- Empty state: not applicable in v1, categories are fixed sample data.
- Loading state: not applicable, data is in the page.
- Error state: not applicable, nothing is loaded from a server.
- Copy: "Choose a skill to prove" · "Pick a category. Each task takes 15–20 minutes." · cards "SQL", "Junior Frontend", "Junior Backend" with "1 task" / "0 tasks".

### 2. Category tasks
- Purpose: pick one task in the chosen category.
- First thing seen: the category name as heading and one card per task with its time in minutes.
- Primary action: select a task card.
- Secondary actions: "← All categories".
- Empty state: "No tasks in this category yet. Try another category."
- Loading state: not applicable.
- Error state: not applicable.
- Copy: category name · task title · "15 min".

### 3. Task
- Purpose: read the task and write a solution.
- First thing seen: task title, task description, a "Your solution" box with starter code.
- Primary action: "Submit solution".
- Secondary actions: "← All categories".
- Empty state: the solution box starts with starter code, not empty.
- Loading state: the button changes to "Running tests…" and cannot be pressed again.
- Error state: submitting an empty box or only the starter code shows "Write your solution first. The starter code alone does not count." The person stays on the screen and keeps what they wrote.
- Copy: "Your solution" · "Submit solution" · "Running tests…".

### 4. Skill report
- Purpose: see the result and share it with an employer.
- First thing seen: "Your skill report", the task title and "Score: N / 100".
- Primary action: "Share report".
- Secondary actions: "Try again" (back to the task), "Choose another task" (back to screen 1).
- Empty state: not applicable, a report always has results.
- Loading state: not applicable, shown after tests finish.
- Error state: in v1 a failing test is a result, not an error: it shows ❌ next to the test name.
- Copy: "Your skill report" · "Score: N / 100" · "Automated tests: X of Y passed" · "AI review" · "Share report" · "Try again" · "Choose another task" · after sharing: "Link ready to send: …".

## Flows

Main flow: from choosing a skill to a report the person can share.

1. **Choose a skill**: select "SQL".
2. **Category tasks**: select "Top 3 customers by order total".
3. **Task**: read the description, write a query in "Your solution", select "Submit solution".
4. **Task**: see "Running tests…" for about a second.
5. **Skill report**: see the score and which tests passed.
6. **Skill report**: select "Share report" and see the link to send.

## Prototype
Link: https://team-project-azure-pi.vercel.app/?prototype
Tool used: our own app (Vite + React) with sample data, built with Claude Code. No database, no real AI. Code: `src/prototype/`.

## Hallway tests
Two participants, three tasks, think-aloud, 15 minutes each. Record: what they tried first, where they hesitated, what they said, whether they finished.

Consent, read out first: "I am testing the design. You cannot do anything wrong. I will write down what you do and say, for a course project. I will not write your name. You can stop at any time. Is that OK?"

Tasks to give, one at a time:
1. "You want to prove your SQL skill. Find a task you could do."
2. "Submit an answer to that task and find out how you did."
3. "Send your result to an employer."

### Participant A (role, no name)
- Date:
- Role:
- Consent: yes / no
- Task 1: what they tried first, where they hesitated, finished yes/no
- Task 2:
- Task 3:
- Quotes (only with consent):

### Participant B (role, no name)
- Date:
- Role:
- Consent: yes / no
- Task 1:
- Task 2:
- Task 3:
- Quotes (only with consent):

## Changes made after testing
At least three. For each: what we saw or heard, and what we change.

1.
2.
3.
