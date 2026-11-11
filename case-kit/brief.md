# Case Interview: Build the Fix with AI

**The case:** bring students back to Resources.

## Your role

You are the product manager for the BYU Product Management Association (PMA) website. The site is a small React app with a public marketing side (home, team, events, hackathon, students, companies) and a members only content library at `/resources`.

## The business goal

PMA wants students to come back to Resources every week during recruiting season. Interview prep, APM deadlines, and job boards only help if people actually use them in the weeks that matter.

## The north star

**Weekly active members on /resources:** the number of distinct logged in PMA members who viewed the unlocked `/resources` page at least once in a Sunday to Saturday week.

| Week | Weekly active members |
| --- | --- |
| Oct 11 to 17 | 41 |
| Oct 18 to 24 | 33 |
| Oct 25 to 31 | 30 |
| Nov 1 to 7 | 23 |

It fell from 41 to 23 over the last 30 days. Recruiting season peaks in about three weeks, so this is the worst possible time for the number to drop.

## Your job

You have one hour, with about 40 minutes of work time. Use the data, the user interviews, and any AI tools you like to find out why engagement is slipping, then ship a fix. Your team presents four things:

1. **Problem.** One or two sentences naming the most important reason the north star is falling, and why it beats the other causes you considered. Pick one. Saying "everything" is not an answer.
2. **Evidence and size.** At least one number you computed from the data, at least one quote from an interview or the feedback, and how many members this problem touches. Say how you got the numbers.
3. **Proposed feature.** A short spec: who it is for, what it does, what you are not building, and the metric that tells you it worked.
4. **Something shipped.** A working change, a clickable prototype, or a pull request. Rough is fine. Real beats pretty.

Watch out: not every scary chart is the cause, and not every loud request is the right thing to build.

Partway through, facilitators share one more piece of evidence. Use it to sharpen your why, not to switch problems. Submit one link per team at https://pma-website-bay.vercel.app/submit before the share out.

## Think like a PM

These are the moves an interviewer listens for in a product case.

* **Size it.** How many members does this cause touch, and how much of the drop from 41 to 23 does it explain? A cause behind three lost members is a footnote.
* **Prioritize it.** List two or three candidate fixes and score each on impact, confidence, and effort. Effort counts: you have about 20 minutes to build.
* **Scope it.** Say who it is for and what you are not building. The smallest version that tests your idea wins.
* **Measure it.** Name one metric your fix should move and one guardrail it must not break.

## What is in the kit

| File | What it is |
| --- | --- |
| `events.csv` | Site analytics for Oct 11 to Nov 9, 2026: page views, searches, clicks, video opens, signups, logins |
| `users.csv` | Every account: when they signed up, when they became a member, how often they visit |
| `feedback.csv` | Ratings and comments from the Resources page plus messages sent to the club inbox |
| `interviews/` | Five short user interview transcripts with BYU students |
| `data-dictionary.md` | What every column means |

The whole kit is small enough to upload to the free version of ChatGPT, Claude, or Gemini.

## Two ways to work

Use whatever your team is comfortable with, or mix them.

**In a chat.** Upload the kit to ChatGPT, Claude, or Gemini and ask questions until you find the cause. Then mock your fix as a Claude artifact, or in Lovable or v0. Ship a share link with your spec.

**In the code.** Fork this repo and run `npm install` right away, then `npm run dev`. Change the real site with Claude Code, Codex, Cursor, or any editor. Ship a pull request against this repo with your spec in the description.

## What you get out of it

There is no judging. This is a real PM project you can put on your resume: you found a problem in product usage data, backed it with evidence, and shipped a fix with AI. PMA officers look through every submission, and the best changes get merged into the live PMA site with your names on them.

Strong work finds a real cause, backs it with a number and a quote, ships a fix that addresses that cause, and names a metric you would watch after launch. That is also what makes a good resume bullet.
