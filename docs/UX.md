# UX specification

Written in words so an agent can build a prototype in one pass and a tester can follow it.

v1 covers the job-seeker (see PRODUCT.md). Core stories: S2 choose a category, S3 open a task, S4 submit a solution and see test results. The prototype also shows a demo sign-in (S1), the report and sharing (S6, S7) and history (S8) with sample data, plus a task author role that adds tasks. The real AI review (S5) is not in the prototype.

All screens after sign-in have a top bar: "JobBridge" · "Dashboard" · "Tasks" · "History" (job-seeker) or "Add task" (author) · the user's name · "Sign out".

### 0. Sign in (demo)
- Purpose: enter the prototype as a job-seeker or a task author.
- First thing seen: "JobBridge", fields "Name" and "Email", a choice "I am: looking for a developer job / a task author".
- Primary action: "Sign in".
- Empty state: not applicable.
- Loading state: not applicable, nothing is sent to a server.
- Error state: "Enter your name and a valid email."
- Copy: "Demo only: no password, use a made-up name and email. Data stays in this browser."

### 0a. Dashboard (job-seeker)
- Purpose: see progress and start a task.
- First thing seen: "Hi, <name>", three numbers: attempts, best score, tasks tried.
- Primary action: "Start a task" (goes to screen 1).
- Secondary actions: open one of the recent reports.
- Empty state: "No reports yet. Start a task to get your first one."

### 0b. History (job-seeker)
- Purpose: see every attempt and reopen a report.
- First thing seen: table with date, task, tests passed, score, newest first.
- Primary action: "Open report".
- Empty state: "No attempts yet. Your reports appear here after you submit a task."

### 0c. My tasks and Add a task (task author)
- Purpose: publish tasks for job-seekers.
- First thing seen: "Hi, <name>", "Add a task" and the list "My tasks" (category, number of checks, minutes).
- Form fields: Category, Title, Time in minutes, Description, Starter code (optional), Checks (one per line: "test name | text the solution must contain").
- Primary action: "Publish task". After publishing: "Task published: <title>", and the task appears in its category for job-seekers.
- Empty state: "You have not published any tasks yet."
- Error states: "Add a title and a description." · "Time must be between 5 and 60 minutes." · "Add at least one check, like: Uses GROUP BY | group by"


## Screens

### 1. Choose a skill (categories)
- Purpose: pick which skill to prove.
- First thing seen: heading "Choose a skill to prove" and one card per category with its number of tasks.
- Primary action: select a category card.
- Secondary actions: none.
- Empty state: not applicable in v1, categories are fixed sample data.
- Loading state: not applicable, data is in the page.
- Error state: not applicable, nothing is loaded from a server.
- Copy: "Choose a skill to prove" · "Pick a category. Each task takes 15–20 minutes." · cards "SQL", "Junior Frontend", "Java", "Python", "Junior Backend" with "1 task" / "2 tasks" / "0 tasks".

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
- First thing seen: task title, task description, a "What we check" list with the name of every check, a "Your solution" box with starter code and a hint under its label.
- Primary action: "Submit solution".
- Secondary actions: "← All categories".
- Empty state: the solution box starts with starter code, not empty.
- Loading state: the button changes to "Running tests…" and cannot be pressed again.
- Error state: submitting an empty box or only the starter code shows "Write your solution first. The starter code alone does not count." The person stays on the screen and keeps what they wrote.
- Keyboard: in the code box, Tab adds 4 spaces. Esc, then Tab, leaves the box.
- Copy: "What we check" · "Your solution" · "Replace the comment in the starter code with your code. Tab adds spaces; press Esc, then Tab, to leave the box." · "Submit solution" · "Running tests…".

### 4. Skill report
- Purpose: see the result and share it with an employer.
- First thing seen: "Your skill report", the task title and "Score: N / 100".
- Primary action: "Share report".
- Secondary actions: "Try again" (back to the task), "Back to dashboard".
- Empty state: not applicable, a report always has results.
- Loading state: not applicable, shown after tests finish.
- Error state: in v1 a failing test is a result, not an error: it shows ❌ next to the test name.
- Copy: "Your skill report" · "Score: N / 100" · "Automated tests: X of Y passed" · "AI review" · "Share report" · "Try again" · "Back to dashboard" · after sharing: "Link ready to send: …".

## Flows

Main flow: from choosing a skill to a report the person can share.

1. **Sign in**: enter a made-up name and email, keep "looking for a developer job", select "Sign in".
2. **Dashboard**: select "Start a task".
3. **Choose a skill**: select "SQL".
4. **Category tasks**: select "Top 3 customers by order total".
5. **Task**: read the description, write a query in "Your solution", select "Submit solution".
6. **Task**: see "Running tests…" for about a second.
7. **Skill report**: see the score and which tests passed.
8. **Skill report**: select "Share report" and see the link to send.

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

### Participant A (job-seeker applying for developer internships, no name)
- Date: [to fill in]
- Role: applies for developer internships (Fullstack developer, Firmware engineer). Said they got no feedback after applying and were not given any test tasks.
- Consent: yes
- Tasks run: signed in, started a task, solved the Java "Sum of two numbers" task, then a Python task.
- Sign-in: filled in the full name. Finished ✅
- Java "Sum of two numbers": 100 / 100. Finished ✅
- Python task: first 33 / 100, then 100 / 100 after changing the solution. Finished ✅
- What they noticed (notes, not exact words):
  - The Python check only looked for "hello" and "!", not whether the code works.
  - Did not know what `pass` in the starter code means, or that it should be replaced.
  - No tips: the checks are hidden, so they did not know what the solution must contain. Wanted to see the instructions and conditions.
  - The task was not understandable and did not give full information.
  - In the code box, Tab moved to the next element instead of adding spaces. **[our note: interpretation of "While Tab switches label"]**
  - In the task author form, the field "Checks, one per line: test name | …" was confusing.
  - Would like a report or a badge to share with people.
- Quotes: none written down word for word.

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

1. **Show what is checked.** Participant A said there were no tips and the checks were hidden. The task screen now lists "What we check" before submitting, with a hint under "Your solution". PR #26.
2. **Explain `pass` in Python.** Participant A did not know about `pass`. The Python starter code now says `# replace pass with your code`, and the task text explains it. PR #26.
3. **Tab in the code box.** Participant A's Tab key left the code box. Tab now adds 4 spaces; Esc, then Tab, leaves the box, so keyboard users are not trapped. PR #26.
4. **Clearer author form.** Participant A was confused by the "Checks" field. It now has a short label and a hint with an example. PR #26.
5. **Be honest about the checks.** Participant A saw that the Python check only looked for "hello" and "!". The report now says the prototype checks look for key parts of the code and do not run it. Running real tests is planned for the real version.
6. **Later (v2 idea, on the board):** a shareable badge for the report, as Participant A asked.
