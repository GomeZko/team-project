# JobBridge · Product statement (G1)

Scope of v1: **only the job-seeking student side**. There is no employer-facing interface.

Evidence: an anonymous survey of 9 junior and aspiring developers, run by Daniel Ivanenko on 28.09.2026. Summary: [docs/interviews/2026-09-28-survey-summary.md](interviews/2026-09-28-survey-summary.md). All numbers are self-reported by the respondents. We have not interviewed anyone in person yet; see "What we do not know yet".

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

## Red-team notes

The hardest questions about our idea, and what our evidence says:

1. **"Juniors already have proof: GitHub and projects."** Partly true. Asked how many of their last 10 applications had objective proof attached, the median answer was 7. We think many counted GitHub or personal projects, so the question was read in different ways. We will ask in follow-up chats what they count as proof, and whether employers look at it.
2. **"Will an employer trust or even open a JobBridge report?"** Unknown. v1 has no employer side, and nobody in our survey is an employer. We need at least one conversation with someone who hires juniors.
3. **"Is a faster assessment the real problem, or is it the CV screen?"** 5 of 9 are rejected at the CV screen. We assume a skill report could get a CV past that screen, but we have not tested it.
4. **"Would juniors use it?"** 6 of 9 rated "how much more likely to apply or feel confident" with a free skill report at 4 or 5 out of 5 (mean 3.9). That is a stated intention, not behaviour.
5. **"Is 9 answers enough?"** No. It is a small sample, and 4 respondents are not applying yet. It shows a direction, not a measured baseline.

## What we do not know yet

- How many applications a junior sends per week and how many interview invitations they get. The survey did not ask, so we do not use this as our baseline.
- How one client goes through a real application, step by step. 3 respondents agreed to a 15-minute follow-up chat; Daniel will contact them and add the notes to `docs/interviews/`.
- What smallest version a client would actually test: one task, one skill?
