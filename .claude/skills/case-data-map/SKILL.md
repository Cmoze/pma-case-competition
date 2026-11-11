---
name: case-data-map
description: Map of every data source in the PMA case kit ("Engagement Is Slipping" / bring students back to Resources). Use when someone asks what data exists, where the data is, what a column or event means, what the tables/CSVs/files are, how weeks or the north star are defined, how files join, or before running any analysis on events.csv, users.csv, feedback.csv or the interviews. Also use when another case skill needs a field definition or a caveat.
---

# Case kit data map

Use this to orient fast: what files exist, what each field means, how they join, and the traps in the data.

## Hard rule: find and show data, do not decide

This skill and the other case skills (`engagement-metrics`, `user-research`, `member-segments`) exist to **find and display evidence for the student, who is the decision maker**.

- Do: show tables, counts, verbatim quotes, trends; cite the file (and row id / file:line); name data gaps and caveats; describe what a pattern is ("zero-result searches were 81% of W4 searches").
- Do not: pick the problem, rank causes, recommend a feature or fix, draft the spec, write the presentation, or say what the student "should" do. If asked, say that choice is the team's, and offer more data that would help them decide.

## Where everything is

All case data is in `case-kit/` at the repo root. There is no database, no SQL and no migrations for the case: the evidence is three CSVs and five Markdown interviews. (The site's own `src/lib/localDb/seed.ts` is demo login data for the running website, **not** case evidence.)

| File | Rows | What it holds |
| --- | --- | --- |
| `case-kit/brief.md` | n/a | The case, the north star definition and weekly values, what teams present |
| `case-kit/data-dictionary.md` | n/a | Official column definitions (source of truth; this skill summarizes it) |
| `case-kit/events.csv` | 6,377 events | Site analytics, Oct 11 to Nov 9, 2026 |
| `case-kit/users.csv` | 343 accounts | Every account, including ones created before the window (earliest signup Feb 2025) |
| `case-kit/feedback.csv` | 120 rows | Resources rating form (93 rows) + club inbox emails copied in by officers (27 rows) |
| `case-kit/interviews/01-maren.md` ... `05-colby.md` | 5 transcripts | Short user interviews, week of Nov 2 |
| `public/case-kit.zip` | n/a | Zipped copy of `case-kit/` (do not edit or commit) |

Site source that the data describes (useful for context, not evidence):

| Path | Relevant to |
| --- | --- |
| `src/pages/ResourcesPage.tsx` | The `/resources` page, its search box (`searchResults`, title/description substring match) and category cards |
| `src/lib/resources.ts` | Resource titles/descriptions (what `resource_click` / `category_open` detail values refer to) |
| `src/lib/videoLibrary.ts` | Practice interview videos: topic tab, `minutes`, `startHere` (what `video_open` detail values refer to) |
| `src/components/resources/PracticeInterviews.tsx` | The Practice Interviews section on `/resources` |
| `src/components/LockedResourcesView.tsx` | The members-only lock screen (what `locked_view` shows) |
| `src/contexts/AuthContext.tsx` | How sign in and member status are determined in the demo site |

## Schemas

### events.csv (one row per tracked event, sorted by time)

| Column | Meaning |
| --- | --- |
| `event_id` | Unique id, `e_000001` style |
| `user_id` | Logged-in account (`u_0001` style), joins to users.csv. Blank when not logged in |
| `anon_id` | Browser id when not logged in (`a_00001`). Blank when `user_id` set. Not linked to accounts, except: in a session where someone signs up, the earlier events carry `anon_id` and share `session_id` with the new account's events |
| `session_id` | One visit (`s_00001`); ends after 30 min idle |
| `timestamp` | ISO 8601, Utah local time with offset (`-06:00` until Oct 31, `-07:00` from Nov 1, DST) |
| `path` | `/`, `/resources`, `/hackathon`, `/hackathon/faq`, `/events`, `/events/ask`, `/students`, `/game`, `/team`, `/companies`, `/contact`, `/roadmap`, `/auth` |
| `event` | See event types below |
| `detail` | `search`: query text. `resource_click`: resource title. `category_open`: category title. `video_open`/`video_exit`: video title. Else blank |
| `results_count` | `search` only: results shown |
| `seconds` | `video_exit` only: seconds from opening to leaving the video |
| `device` | `desktop` or `mobile` |

Event types and totals in the file: `page_view` 4,749; `locked_view` 726; `login` 231; `category_open` 167; `signup` 136; `resource_click` 128; `search` 106; `video_open` 67; `video_exit` 67.

| Event | Meaning |
| --- | --- |
| `page_view` | Page loaded. On `/resources` it means the **unlocked** library was shown (so the viewer was a member) |
| `locked_view` | `/resources` opened but the members-only lock screen was shown |
| `search` | Query typed in the `/resources` search box |
| `category_open` | Category card opened on `/resources` (4 categories appear: PM Interview Prep, APM Job Postings, Build with AI, Community & Networking) |
| `resource_click` | A resource card's Open button |
| `video_open` / `video_exit` | Practice Interviews video opened / left |
| `signup` / `login` | On `/auth` |

### users.csv (one row per account)

| Column | Meaning |
| --- | --- |
| `user_id` | Joins to events.csv and feedback.csv |
| `signup_at` | Account created |
| `class_year` | Freshman, Sophomore, Junior, Senior, Graduate (self reported) |
| `major` | Self reported (13 values) |
| `email_domain` | Always `byu.edu` in this data (no variation, not useful for segmenting) |
| `confirmed_at` | Email confirmed; blank if never |
| `member_approved_at` | Member access granted (unlocks `/resources`); blank if not granted |
| `last_seen_at` | Most recent activity (can be before Oct 11) |
| `sessions_30d` | Sessions between Oct 11 and Nov 9 |

### feedback.csv

| Column | Meaning |
| --- | --- |
| `feedback_id` | `f_001` style |
| `user_id` | Sender; blank when an email could not be matched (3 rows) |
| `submitted_at` | Timestamp |
| `page` | `/resources` = rating form at the bottom of Resources (members only). `email` = club inbox message copied in by officers |
| `rating` | 1 (not helpful) to 5 (very helpful). Blank for email rows |
| `comment` | Free text, can be blank (17 rows blank) |

### interviews/*.md

Five transcripts, format `**Speaker:** text`. Interviewer is `PMA PM`. Each file's line 3 gives class year, major, membership status and interview date. Names are changed; **interviewees cannot be linked** to users, events or feedback.

## Definitions and joins

- **Weeks** are Sunday to Saturday in Utah local time. Use the first 10 characters of the timestamp as the local date. W1 Oct 11-17, W2 Oct 18-24, W3 Oct 25-31, W4 Nov 1-7, W5 Nov 8-9 (**partial, 2 days; leave out of week comparisons**).
- **North star** = distinct `user_id` with `event=page_view` and `path=/resources` in a week. Brief values: 41, 33, 30, 23 (W1-W4); the scripts reproduce these exactly.
- **Member at event time**: `users.member_approved_at <= events.timestamp`.
- Joins: `events.user_id = users.user_id`, `feedback.user_id = users.user_id`. Pre-signup anonymous activity joins only through a shared `session_id` in the signup session.

## Caveats to repeat whenever relevant

- Rows are not people. Feedback has repeat submitters (10 people wrote 45 of 120 rows). Always show distinct submitters next to row counts.
- Anonymous ids are per browser, so distinct `anon_id` is not distinct people.
- `seconds` on `video_exit` is time until leaving, not confirmed watch time. Video lengths and topics are not in the CSVs; they come from `src/lib/videoLibrary.ts` (today's site source, which may differ from what was live in October).
- `/resources` feedback form is only visible to members, so non-members can only appear in `email` rows.
- Interviews are 5 people, chosen by the PM: illustrative, not representative.
- The data shows what happened, not why. Approval timing, for example, has no "who approved" or "why it took that long" field.
- The case page says facilitators share **more evidence around 0:17** of the event. That evidence is **not in this repo**; if a student pastes it in, treat it as a new source and cite it as such.

## Helper scripts

Shared, dependency-free Node (18+) helpers in `scripts/lib.mjs` (CSV parsing, week bucketing, north star, table printing). Run the other skills' scripts from the repo root with `node .claude/skills/<skill>/scripts/<file>.mjs`. They work in PowerShell, cmd, macOS Terminal and Git Bash. Paths like `/resources` may be passed as `resources` too (Git Bash rewrites leading slashes; the scripts undo that).
