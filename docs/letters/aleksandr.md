# Reflection letter · Aleksandr Gomžin

Role: Delivery Lead (shared files, task board and publishing).

## What I now know I am good at
- Keeping the whole project in view. I went through all ten gates early, wrote down what was missing for each one and kept that list up to date, so the team always knew what was next.
- Turning a vague idea into small, checkable steps. Moving onto the course template, the Vercel deploy, the board with epics and stories, and the database tables each went in as their own PR with a test.
- Reviewing other people's work. I reviewed Daniel's interview notes and Oleksandr's phone layout fix, and I asked for changes when something was missing, not only approved.
- Working with an AI agent without handing it my decisions. I said no when it went too far: no interview quotes without consent, no guesses written as facts, no delete rights on tables that no story needs.

## What I would do differently
- Commit every week from the start. G10 asks for commits in six different weeks, and in September I did a lot of work in one go and then nothing for weeks. Spreading the same work out would have been easy.
- Protect `main` with a branch rule in the first week. Our first PR was merged before CI finished.
- Make sure every teammate has access to every service. Our Supabase project is in one person's account, so at the end only he could run the database migration.

## What I would tell next year's team
- Read the gates on the first day and put each one on the board as a card with an owner.
- Keep pull requests small (under 300 lines). Our one big PR caused the only painful merge conflict.
- Before you move a card to Done, open the dev URL as a new visitor and check every acceptance criterion yourself.
- Talk to real users early. Two interviews changed who our client is more than weeks of planning did.
- Use the agent for the work, but write down what you accepted and what you rejected. The session logs show you what you actually learned.
