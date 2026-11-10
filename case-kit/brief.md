# AI PM Case Competition: Bring Students Back to Resources

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

You have about 40 minutes of work time. Use the data, the user interviews, and any AI tools you like to find out why engagement is slipping, then ship a fix. Your team presents four things:

1. **Problem.** One or two sentences naming the most important reason the north star is falling. Pick one. Saying "everything" is not an answer.
2. **Evidence.** At least one number you computed from the data and at least one quote from an interview or the feedback. Say how you got the number.
3. **Proposed feature.** A short spec: who it is for, what it does, what you are not building, and the metric that tells you it worked.
4. **Something shipped.** A working change, a clickable prototype, or a pull request. Rough is fine. Real beats pretty.

Watch out: not every scary chart is the cause, and not every loud request is the right thing to build.

### Today's clock

| Room clock | What to do |
| --- | --- |
| 0:00 to 0:07 | Framing. Listen, and Track 3 teams start npm install now |
| 0:07 to 0:22 | Discover. Analyze the data and interviews with AI. Around 0:17 facilitators share more evidence |
| 0:22 to 0:25 | Pick one problem and write a five line spec |
| 0:25 to 0:46 | Build and ship |
| 0:46 | Submit your link at https://pma-website-bay.vercel.app/submit |
| 0:48 | Judging. Three or four teams present for two minutes each |
| 0:58 | Wrap |

## What is in the kit

| File | What it is |
| --- | --- |
| `events.csv` | Site analytics for Oct 11 to Nov 9, 2026: page views, searches, clicks, video opens, signups, logins |
| `users.csv` | Every account: when they signed up, when they became a member, how often they visit |
| `feedback.csv` | Ratings and comments from the Resources page plus messages sent to the club inbox |
| `interviews/` | Five short user interview transcripts with BYU students |
| `data-dictionary.md` | What every column means |

The whole kit is small enough to upload to the free version of ChatGPT, Claude, or Gemini.

## Pick a track

You can mix tracks. Pick the one that fits your team.

**Track 1: Chat AI with uploads.** Upload the CSVs and interviews to ChatGPT, Claude, or Gemini. Ask it to compute numbers, find patterns, and draft your spec. Ship a written spec plus a mockup or a message you would send to users.

**Track 2: Prototype or artifact.** Use Claude artifacts, Lovable, v0, or a similar tool to build a clickable prototype of your fix. Ship the link.

**Track 3: Pull request.** Fork this repo, run `npm install` and `npm run dev`, and change the real site with Cursor, Claude Code, or any editor. Ship a pull request against this repo with your spec in the description.

## Judging

Teams are judged on whether they found a real cause backed by evidence, whether the fix addresses that cause, and whether they shipped something that works. Bonus points for naming a metric you would watch after launch.
