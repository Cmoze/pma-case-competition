---
name: member-segments
description: Compare users and cohorts in the PMA case using case-kit/users.csv joined to events.csv - account counts, the new-account funnel (signup, email confirmed, lock screen, member approved, unlocked /resources), days from signup to member approval, week-over-week retention of north star members (retained, new, reactivated, dropped), whether users came back after a given experience (e.g. a zero-result search or a video open), and a full timeline for one user. Use when asked about cohorts, segments, new vs returning members, retention, churn, who dropped off, signups, approvals, membership, the lock screen, class year differences, or "what did user u_XXXX do".
---

# Member segments and cohorts

Shows who the users are, how accounts move from signup to member, and which members keep coming back. Everything prints as markdown tables with sources.

## Hard rule: find and show data, do not decide

The student is the PM and makes the call. This skill shows cohort sizes, funnels, lags and retention, cites the files, and names caveats. It **does not** say which segment or cause explains the north star, recommend a fix, or write the student's problem, spec or pitch. Describing a pattern is fine ("19 of 41 W1 members were not active in W2"); saying what the team should do about it is not. If asked to choose, say that is the team's call and offer another cut.

## How to run

From the repo root (PowerShell, cmd, Terminal, Git Bash; Node 18+, no installs):

```
node .claude/skills/member-segments/scripts/segments.mjs <command> [flags]
```

| Command | What it shows |
| --- | --- |
| `accounts [--by class_year\|major\|tenure]` | All 343 accounts: confirmed, member approved, any session in the window, median `sessions_30d` |
| `funnel [--by signup_week\|class_year\|major]` | Accounts created Oct 11-Nov 9: signed up, email confirmed, saw the lock screen while logged in, member approved by Nov 9, saw unlocked /resources |
| `approval-lag` | Days signup to approval (and confirmation to approval) by signup week, accounts still waiting and how long, pre-window comparison, approvals granted per week |
| `retention` | North star members each week split into also active prior week / back after a gap / first active week in data / dropped since prior week; W1 cohort survival |
| `return-after --event search --zero-results` | Logged-in users grouped by the week of their first matching event, and how many had an unlocked /resources view in a later week. Works for any event (`video_open`, `resource_click`, `locked_view`, ...) and `--path`. Run a second event as a baseline before comparing |
| `user u_0321` | One account: users.csv row, every event (including pre-signup anon events in the signup session), and their feedback rows |

(`\|` above is Markdown escaping; type `--by tenure` etc. normally.)

For other cuts, write a short Node snippet importing `.claude/skills/case-data-map/scripts/lib.mjs` and show the code so the student can explain the number.

## Output format

1. Tables as printed.
2. One or two sentences describing what the table shows.
3. Source line and the caveats that apply.
4. Stop, optionally offering a related cut.

## Caveats to include when relevant

- Later signup weeks have had less time to get approved or to come back. Do not read a lower W4 share as a trend without saying this.
- `return-after` shares fall toward W4 for everyone because there are fewer later weeks; compare to a baseline event.
- "First active week in data" means first in this 30-day window only.
- The data records *when* approval happened, not who approved it or why it took that long.
- Segments with a handful of people swing on one person. Show the n.
- `email_domain` is always `byu.edu`; it cannot be used to segment.
- Interviewees are not identifiable in these files.

See `case-data-map` for field definitions.

## Verified sample output

`retention`:

| Week | Active members | Also active prior week | Back after a gap | First active week in data | Active prior week but not this week |
| --- | --- | --- | --- | --- | --- |
| W1 Oct 11-17 | 41 |  |  | 41 |  |
| W2 Oct 18-24 | 33 | 22 | 0 | 11 | 19 |
| W3 Oct 25-31 | 30 | 17 | 8 | 5 | 16 |
| W4 Nov 1-7 | 23 | 12 | 3 | 8 | 18 |
