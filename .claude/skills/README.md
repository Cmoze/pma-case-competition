# Case research skills

This folder gives AI coding tools (Claude Code, and other agents that read `.claude/skills`) four skills for digging into the case kit. They load automatically when you open the repo; you do not install anything. The helper scripts need only Node 18+ (the site already needs Node 22).

| Skill | What it does |
| --- | --- |
| `case-data-map` | Where every file is, what each column and event means, how weeks and the north star are defined, and the traps in the data |
| `engagement-metrics` | North star, weekly trends, page views, searches, videos, clicks, broken down by device, class year, major, tenure or user type |
| `user-research` | What users say in feedback.csv and the interviews: themes, counts of rows and distinct people, verbatim quotes with sources |
| `member-segments` | Accounts, signup-to-member funnel, approval timing, retention of active members, who came back after an experience, one user's timeline |

## How to use them

Just ask in plain language, for example:

* "What data do we have and what does each column mean?"
* "Compute the north star by week and split it by class year."
* "What are users saying about search?" or "Find quotes about the videos."
* "How long does it take a new account to become a member?"
* "Of the members active in week 1, how many came back?"

In Claude Code you can also call one directly: `/engagement-metrics`, `/user-research`, `/member-segments`, `/case-data-map`.

You can run the scripts yourself too, from the repo root:

```
node .claude/skills/engagement-metrics/scripts/metrics.mjs north-star
node .claude/skills/user-research/scripts/research.mjs summary
node .claude/skills/member-segments/scripts/segments.mjs retention
```

Run any script with no command to see everything it can do.

## What they will not do

These skills find and show evidence: tables, counts, trends, quotes, sources and caveats. They will not pick your problem, recommend a fix, or write your spec. That is your job as the PM.
