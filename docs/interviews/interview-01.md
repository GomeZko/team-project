# Interview 01: junior, actively applying for a first IT job in technical support / Linux

- Date: 26.10.2026
- Interviewer: Daniel Ivanenko
- Format: Discord voice call, recorded
- Length: about 17 minutes
- Survey respondent: one of R2, R3, R6, R8, the people actively applying (from [2026-09-28-survey-summary.md](2026-09-28-survey-summary.md))
- Consent: the interviewer said the call is recorded to write it up; an explicit "yes" is not on the recording. **To do:** confirm consent in writing in the chat.
- Recording: kept in the team's private Google Drive, never in this repository. Deleted after the course.

The interview is in Russian; notes and quotes are translated to English. No real names or Discord handles in this file. Notes are what the person said; our interpretations are marked **[our note]**. Numbers are self-reported estimates.

## Plan

### What we want to learn
Each goal closes a gap written down in [docs/PRODUCT.md](../PRODUCT.md).

1. **What they count as "objective proof" of a skill.** The survey median was 7 of 10 applications with proof, which does not fit our problem statement. Red-team note 1.
2. **One real application, step by step.** "What we do not know yet" in PRODUCT.md.
3. **The missing numbers:** applications per week and interview invitations.
4. **Does anyone on the employer side look at their proof?** Red-team notes 2 and 3.
5. **Reaction to JobBridge and the smallest version they would try.** Red-team note 4.

### Rules for the interviewer
- Ask about what they **did**, not what they **would do**. "Tell me about the last time…" beats "Would you…?"
- Do not explain or sell JobBridge before part 4. Ideas shown early change the answers.
- After an answer, ask "Why?" or "Can you give an example?" once before moving on.
- Silence is fine. Count to five before the next question.

### Timing

| Min | Part | Goal |
|---|---|---|
| 0–1 | Intro and consent | — |
| 1–5 | 1. The search and the last application | 2, 3 |
| 5–9 | 2. Proof of skills | 1, 4 |
| 9–11 | 3. Numbers | 3 |
| 11–14 | 4. JobBridge | 5 |
| 14–15 | Close and next step | G8 booking |

### Questions

**Intro (say this):** "Thanks for the time. We are a student team studying how junior developers look for their first job. There are no right answers. I would like to record this call so I do not miss anything. The recording stays private to our team, and in our notes you will have no name. Is that OK?" Start the recording only after a yes.

**1. The search and the last application**
1. How long have you been looking, and roughly how many applications have you sent in total?
2. Tell me about the last developer job you applied for. Where did you find it?
3. What did you send? CV, links, anything else?
4. What happened after that? How long did it take?
5. If you were rejected or got no reply: what do you think the reason was? Did anyone tell you?

**2. Proof of skills**
6. In the survey you could say "objective proof of a skill". What do you count as proof? Give me an example from a real application.
7. Do you know if anyone opened your GitHub or projects? How do you know?
8. Have you ever been asked to prove one specific skill, like SQL? What did you do?

**3. Numbers** (estimates are fine)
9. How many applications do you send in a usual week when you are searching?
10. Out of your last 10 applications, how many led to an interview invitation?

**4. JobBridge** (now explain in one sentence, then open https://team-project-azure-pi.vercel.app)
> "The idea: you solve a short coding task, it is checked automatically, and you get a skill report or badge to attach to applications."
11. What is your first reaction? What would make you not use it?
12. Which one skill would you want a report for first?
13. Would you put the report link in your next application? Where: CV, LinkedIn, cover letter?

**Close**
14. Do you know anyone who hires or screens junior developers who might talk to us for 10 minutes?
15. In the week of 3–8 November we will test the working version for 15 minutes. Could you take part? Which day and time suit you?

## Notes

**Plan deviation:** the person applies for L2 technical support and Linux/server roles, not developer roles. Their answers are useful, but they are a neighbouring segment to our client. Questions 14 (contact who hires) and 15 (product test booking) were not asked, and the prototype was not shown.

### How they apply for jobs today
- How long searching, applications in total: since July, about 4 months; about 20 applications.
- Channels / job boards: LinkedIn (the last application, today, for an L2 support role); Telegram channels, where you just send the CV.
- What they send: a CV everywhere. Larger, English-speaking companies add a short form: the CV is parsed, plus questions about overtime, the contract, language level and past work. They called this "the most basic HR call".
- Wait time: an interview invitation usually comes from the next day up to a week. Once it took 1.5 weeks because the HR person was ill. The answer after the interview came exactly one week later.
- Feedback they get from employers: after the last technical interview, a written rejection saying the project turned them down because of hard skills.
- Where the process usually stops: at the technical interview, not at the CV screen. One technical interview did not fit because HR had matched them to the wrong role (the company wanted a developer working with AI agents). In the other, they were asked basic logic (AND, OR, XOR operators).

### Proof of skills
- What they count as proof: they were never asked for objective proof or a certificate. In their field "you cannot really write proof". The only option is a CI/CD workflow on GitHub, and publishing one from work would mean taking the company's work; a private copy for yourself is fine.
- GitHub: they do not link it, because there is nothing to show. Their skills (Linux, its commands, knowing how to fix things) are not measured by the amount or beauty of code. A Dockerfile can be generated with ChatGPT in a minute, and small automation scripts take five minutes.
- Evidence that an employer looked at it: none; no GitHub is linked.

### Numbers (baseline)
- Applications per week: 2–3 in a good week, none in a bad one. They tailor the CV to each role rather than apply everywhere.
- Interview invitations per 10 applications: about 3 at first, then "from 30 to 50 percent". **[our note]** The interviewer suggested "30–40" before the answer, so treat this number as weak.
- Source: self-reported

### Would they use JobBridge?
- Reaction to the idea: the advantages are obvious, the disadvantages are deeper. First, AI can solve the task (the interviewer raised this). Second, and more important: in a technical task what is checked is **how** you solved it: how you thought, what you tried, your hypotheses. For support this is troubleshooting, for example a "502 Bad Gateway" error: find where the chain breaks, localise it with the right commands, then dig into nginx or the cloud.
- What would stop them: a pass/fail result does not show the thinking process. Our tasks are for developers (SQL, Java, Python), not troubleshooting.
- First skill they want a report for: Linux / server troubleshooting (not asked directly; follows from the answers).
- Smallest version they would try: a coding-practice site (they named "DeadCode", probably LeetCode) that gives a certificate such as "solved 100 tasks, 20% of them hard" could work. It would help beginners reach a technical interview because they would have proof that they can do something. They believe no such service gives certificates.

### Quotes (translated from Russian)
> "With this method the pluses are on the surface, but the minuses are a bit deeper."

> "What matters is not that you solved it, but how you solved it: how you thought, what you tried."

> "No such service gives any certificates, although the idea itself would probably be cool."

### Next step
- Contact who hires juniors: not asked
- Product test 3–8.11: not asked. **To do:** message them and book a time.

## [our note] What this tells us
- **Supports PRODUCT.md:** employers did not ask for objective proof before an interview; GitHub is not a working proof for this person.
- **Challenges PRODUCT.md:** this person gets past the CV screen (about 3 of 10) and stops at the technical interview. Our statement says the CV screen is the problem.
- **Challenges our design:** the product checks the final code (pass/fail). This person says employers check the thinking process. An AI review that comments on the approach, or a task that records the steps, could answer this.
- **Competitors:** they compare us with a coding-practice site. We think HackerRank already offers skill certificates; this must be checked and named in PRODUCT.md.
- **Segment:** support/DevOps juniors need troubleshooting tasks, not coding tasks. Out of scope for v1, but worth one line in PRODUCT.md.

## [our note] What changes for the next interview
- Questions that did not work: question 10 was answered after the interviewer offered a number. Let the person give the number first. The yes/no question "would you add the report?" invites a polite "yes".
- Questions to add: ask questions 14 and 15 straight after part 4, before time runs out. Ask "Who read your application first, HR or a technical person? How do you know?" Ask for the explicit recording consent first.
