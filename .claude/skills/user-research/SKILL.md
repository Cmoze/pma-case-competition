---
name: user-research
description: Find and summarize what users say in the PMA case - feedback.csv ratings and comments, club inbox emails, and the five interview transcripts in case-kit/interviews. Clusters comments into themes with row counts, distinct people and verbatim quotes with sources. Use when asked "what are users saying about X", "what do the interviews have in common", "find quotes about search / videos / access / dark mode / mobile", "summarize the feedback", "what are the complaints", "who keeps asking for X", "give me a quote for my evidence", or any qualitative / voice-of-customer / user research question.
---

# User research

Finds what users said, counts it honestly (rows and distinct people), and quotes it verbatim with a source id.

## Hard rule: find and show data, do not decide

The student is the PM and makes the call. This skill surfaces quotes, themes and counts, and cites each one. It **does not** decide which theme is the real problem, rank themes by importance, recommend what to build, or write the student's problem statement, spec or pitch. Saying what a pattern is ("8 dark mode rows came from 3 people") is fine; saying what to do about it is not. Volume of complaints is not the same as importance, so never present the loudest theme as the answer. If asked to choose, say that is the team's call and offer more evidence.

## How to run

From the repo root (PowerShell, cmd, Terminal, Git Bash; Node 18+, no installs). Quote regexes that contain `|`.

```
node .claude/skills/user-research/scripts/research.mjs <command> [flags]
```

| Command | What it shows |
| --- | --- |
| `summary` | Feedback by channel and week, rating distribution and weekly average, blank comments, repeat submitters with all their comments, submitter class years |
| `feedback --grep "search\|no results"` | Matching rows verbatim with feedback_id, user_id, class year, date, channel, rating. Filters: `--page /resources` or `--page email`, `--rating 1,2`, `--user u_0201`, `--week W3`, `--with-comment` |
| `themes --theme "search=search\|no results\|nothing came up" --theme "access=locked\|paid\|dues\|approve" ...` | For each theme you define: rows, distinct submitters, max rows from one person, channel split, average rating, which interviewees mention it (line counts), then the verbatim rows. `--show-unmatched` lists comments no theme caught |
| `interviews` | Who was interviewed (class year, major, membership, date) |
| `interviews --grep "search" [--speaker Owen]` | Matching interview lines with `file:line` and speaker |
| `quotes --grep "REGEX"` | Both feedback rows and interview lines for one regex |

(In PowerShell and cmd write the regex as `"search|no results"`; the backslashes above are only Markdown table escaping.)

## Workflow for "what are users saying?"

1. Run `summary` to see volume, ratings and repeat submitters.
2. Read all comments (`feedback --with-comment`) and the five interviews, then draft themes from what is actually there. Do not start from a fixed list.
3. Run `themes` with one `--theme` per cluster and `--show-unmatched`; adjust regexes until each match reads right and unmatched rows are either their own theme or genuinely off-topic (event logistics, hackathon questions, etc.).
4. Present a theme table: theme, feedback rows, distinct people, channel, avg rating, interviewees. Then 1-3 verbatim quotes per theme with `feedback_id` or `file:line`.

## Output rules

- Quote verbatim, in quotation marks, with the source: `"Searched for case interview stuff and got nothing." (feedback.csv f_007, rating 3)` or `(case-kit/interviews/02-owen.md:43, Owen)`.
- Always show distinct people next to row counts. Flag when one person wrote several rows of a theme.
- Say which channel a theme comes from: the `/resources` rating form is visible only to members; `email` rows are the only place non-members appear.
- Note interview limits: 5 hand-picked people, names changed, not linkable to the CSVs. An interviewee's opinion about *why* numbers moved is their opinion, not data.
- End with data gaps (for example: no survey, no support ticket system, no reply/resolution status on emails, no free-text from people who left without writing anything). Then stop.

See `case-data-map` for field definitions.

## Verified sample output

`summary` (excerpt):

| page | W1 | W2 | W3 | W4 | W5 (2 days) | Total rows | Distinct submitters |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /resources | 25 | 28 | 23 | 15 | 2 | 93 | 49 |
| email | 5 | 5 | 6 | 9 | 2 | 27 | 27 |

"Repeat submitters (3+ rows): 10 people wrote 45 of 120 rows."
