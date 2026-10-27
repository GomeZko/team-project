# JobBridge · Product statement (G1)

Scope of v1: **only the job-seeking student side**. There is no employer-facing interface.

Evidence: an anonymous survey of 9 junior and aspiring developers, run by Daniel Ivanenko on 28.09.2026. Summary: [docs/interviews/2026-09-28-survey-summary.md](interviews/2026-09-28-survey-summary.md). All numbers are self-reported by the respondents.

Follow-up interviews: two 1:1 calls by Daniel on 26.10.2026, [interview-01.md](interviews/interview-01.md) (applying for L2 support / Linux roles, a neighbouring segment) and [interview-02.md](interviews/interview-02.md) (looked for a backend trainee role). Two people are not enough to change the baseline; they mainly sharpen the red-team notes below.

## Client

A junior or aspiring software developer in Estonia, looking for their first developer job or about to start looking. For example: a student close to graduation, a bootcamp student or a self-taught developer.

- How we reached them: an anonymous 2-minute Google Form run by Daniel. Where it was shared: unknown, to add.
- Who answered: 4 are actively applying for their first developer role, 4 are studying and not applying yet, 1 got their first developer job in the last 12 months.
- No names are kept in this repository. Respondents are numbered R1–R9.

## The process today

What respondents said they do now:

1. **Find a job.** Mostly on LinkedIn (8 of 9), also CV.ee (5), referrals and friends (5), company websites (3) and Telegram/Discord communities (2).
2. **Apply with a CV and links.** To show they can code they use a GitHub profile (6 of 9), personal projects (6), a technology list in the CV (5), certificates (2) or a portfolio site (2). One has done take-home tasks; one shows nothing beyond the CV.
3. **Wait for an answer.** Most get a generic rejection with no reason (5 of 9) or no reply at all (1). One got useful, specific feedback.

Where it breaks:

- **Before any interview.** 7 of 9 say the process most often stops at the CV screen (5) or with no reply (2). Only 1 reaches a technical interview, and 1 says they usually get offers.
- **No quick, objective proof of a skill.** If an employer asked today for an objective assessment of one skill, such as SQL, 6 of 9 say it would take a few days or longer, or they could not get one at all. 3 say a few hours.
- **No reason given.** With a generic rejection or no reply, the person cannot tell what to improve.

## Baseline metric

**Time to get an objective assessment of one specific skill that can be shown to an employer.**

Today: **a few days or longer for 6 of 9 respondents** (a few days: 3, weeks: 2, could not get one: 1). The other 3 said a few hours.

Source: survey question "If you needed an OBJECTIVE assessment of one specific skill (e.g. SQL) to show an employer TODAY, how long would it realistically take to get one?", 9 answers, 28.09.2026. **Estimate, self-reported by respondents.**

## The statement

When **a junior developer looking for their first job** is **applying for junior developer roles** but **has no quick, objective way to prove a specific skill, so their CV is rejected or ignored before anyone checks what they can do**, **JobBridge lets them complete a short, realistic coding task and get an auto-tested, AI-reviewed skill report they can attach to applications**, so that **the time to get an objective assessment of one skill** goes from **a few days or longer (6 of 9 respondents)** to **under 1 hour**.

The target "under 1 hour" is our proposal (a 15–20 minute task plus the report). It still needs to be agreed with the teacher and checked with a client.

## Out of scope

Three things we will not build in v1, so the agent does not build them either:

1. An employer-facing dashboard, login or portal. Employers only see a report link or PDF that the student shares.
2. Payments or subscriptions.
3. More than one interface language. v1 is English only.

Also not our client in v1: juniors in technical support, Linux or DevOps roles. Interview 01 showed they need troubleshooting tasks, not coding tasks.

## Red-team notes

The hardest questions about our idea, and what our evidence says:

1. **"Juniors already have proof: GitHub and projects."** Partly true. Asked how many of their last 10 applications had objective proof attached, the median answer was 7. We think many counted GitHub or personal projects, so the question was read in different ways. In both interviews nobody had been asked for proof of a skill, and neither person knew of any reaction to their GitHub (interview 01 does not link it at all). This supports the problem, but "what counts as proof" is still not asked word for word.
2. **"Will an employer trust or even open a JobBridge report?"** Unknown. v1 has no employer side, and nobody in our survey is an employer. Interview 02: the first filter is HR, and the person expects HR to ignore the report. This is now our biggest risk. We still need at least one conversation with someone who hires or screens juniors.
3. **"Is a faster assessment the real problem, or is it the CV screen?"** 5 of 9 are rejected at the CV screen. We assume a skill report could get a CV past that screen, but we have not tested it. Interview 01 got past the CV screen (about 3 of 10 invited, weak number) and stopped at the technical interview, so for some juniors the CV screen is not where it breaks.
4. **"Would juniors use it?"** 6 of 9 rated "how much more likely to apply or feel confident" with a free skill report at 4 or 5 out of 5 (mean 3.9). That is a stated intention, not behaviour. Interview 02 would add the report to their CV; interview 01 liked the idea but saw deeper downsides (notes 6 and 7). Still words, not behaviour: the product test on 3–8.11 is meant to check this.
5. **"Is 9 answers enough?"** No. It is a small sample, and 4 respondents are not applying yet. It shows a direction, not a measured baseline. The two interviews do not change that.
6. **"A pass/fail check does not show how you think."** Interview 01: in a technical task employers look at how you solved it, what you tried and why, not only at the result. Our prototype checks the final code. The AI review in the report (S5) should comment on the approach, not only on correctness.
7. **"Someone can solve the task with AI, and others already give certificates."** Interview 01 raised both. They compared us with coding-practice sites and believed none gives certificates; we think HackerRank already offers skill certificates. **To check** before the next gate: name the real competitors and what JobBridge does differently.

## What we do not know yet

- How many applications a junior sends per week and how many interview invitations they get. The survey did not ask. The interviews gave two very different answers (2–3 a week; about 10 in two years), so we still do not use this as our baseline.
- Whether anyone who hires or screens juniors (HR or a technical person) would open a skill report. Nobody asked so far knows such a person; we have to find one ourselves.
- What smallest version a client would actually test: one task, one skill? Not answered in either interview.
- Written consent from both interviewees to use their quotes. Until then the quotes stay in the interview notes only.
