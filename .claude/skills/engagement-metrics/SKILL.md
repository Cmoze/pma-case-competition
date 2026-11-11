---
name: engagement-metrics
description: Pull engagement and usage numbers for the PMA case from case-kit/events.csv - the north star (weekly active members on /resources), weekly trends, page views by path, searches and zero-result searches, practice interview video opens and time before exit, category opens and resource clicks, locked_view counts, and breakdowns by device, class year, major, member tenure or user type. Use when asked "compute the north star", "what is the weekly trend", "how many people searched", "which videos get opened", "what happened to page views", "show engagement by segment", "is the drop real", or any usage/analytics/metrics question about the site.
---

# Engagement metrics

Computes usage numbers from `case-kit/events.csv` (joined to `case-kit/users.csv` for segments) and prints markdown tables with a source line and caveats.

## Hard rule: find and show data, do not decide

The student is the PM and makes the call. This skill shows numbers, trends and breakdowns, cites where each came from, and names the caveats. It **does not** say which cause is "the" problem, rank causes, recommend a fix, or write the student's problem statement, spec or presentation. Describing a pattern is fine ("zero-result share was 70% in W1 and 81% in W4"); telling the student what to do about it is not. If asked for a recommendation, say that is the team's call and offer another cut of the data instead.

## How to run

From the repo root (works in PowerShell, cmd, macOS/Linux Terminal, Git Bash; needs Node 18+, no installs):

```
node .claude/skills/engagement-metrics/scripts/metrics.mjs <command> [flags]
```

| Command | What it shows |
| --- | --- |
| `north-star` | Weekly active members on /resources, W1-W4, with week-over-week change |
| `north-star --by class_year` (or `device`, `major`, `tenure`) | Same, split by segment. `tenure` = member before Oct 11 vs became member in the window |
| `weekly --path /resources --event page_view,locked_view --by user_type` | Events, distinct logged-in users, distinct anon ids, distinct sessions per week for any filter. `--by` can be `event`, `path`, `device`, `user_type` (anonymous / logged in not yet member / member, at event time), `class_year`, `major`, `tenure`, `detail` |
| `pages` | `page_view` counts per path per week (add `--event locked_view` etc. for other events) |
| `top --event search` | Most common `detail` values for an event, with distinct visitors (`--field`, `--path`, `--limit`) |
| `searches` | Every query with count, distinct searchers, results shown, zero-result count; weekly zero-result share; what the same session did next |
| `videos` | Opens, distinct viewers, median/min/max seconds before exit per video, joined to topic tab, length and Start here flag from `src/lib/videoLibrary.ts`; distribution of time before exit; opens by week |
| `clicks` | `category_open` and `resource_click` by title and week |

Add `--include-partial` to show W5 (Nov 8-9, two days only). Run with no command for help.

For anything the commands do not cover, write a short ad hoc Node snippet that imports `.claude/skills/case-data-map/scripts/lib.mjs` (`load("events")`, `weekOf`, `northStarSets`, `usersById`), and show the code you ran so the student can explain how they got the number.

## Output format

1. The table(s) exactly as printed (do not round differently or drop rows without saying so).
2. One or two plain sentences on what the table shows (a description, not an interpretation of cause).
3. The source line (file + filter) and any caveats below that apply.
4. Stop. Optionally offer a related cut of the data ("want this split by class year?").

## Caveats to include when relevant

- W5 is two days; never compare it to full weeks.
- Event counts are not people. Use distinct users/sessions for "how many people".
- Anonymous ids are per browser, not per person.
- `seconds` on `video_exit` is time until the viewer left, not proof of watching. Video length/topic come from current site source, not the CSVs.
- A single week of a small segment (for example 1 to 5 people) can swing on one person.
- Correlation in timing (something else spiked the same week) is not evidence of cause by itself. Say what moved, and that the data does not show why.

See `case-data-map` for full field definitions.

## Verified sample output

`north-star` reproduces the brief exactly:

| Week | Active members | Change vs prior week |
| --- | --- | --- |
| W1 Oct 11-17 | 41 |  |
| W2 Oct 18-24 | 33 | -8 |
| W3 Oct 25-31 | 30 | -3 |
| W4 Nov 1-7 | 23 | -7 |
