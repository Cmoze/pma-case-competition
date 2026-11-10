# Data Dictionary

All data covers **Oct 11 to Nov 9, 2026** unless noted. Timestamps are ISO 8601 in Utah local time (America/Denver) with the UTC offset included. Daylight saving time ended on Nov 1, so offsets change from `-06:00` to `-07:00` on that date. Weeks run Sunday to Saturday; Oct 11, 2026 is a Sunday. Nov 8 to 9 is a partial week of only two days, so leave it out when comparing weeks.

## events.csv

One row per tracked event on the PMA website. Rows are sorted by time.

| Column | Meaning |
| --- | --- |
| `event_id` | Unique id for the event. |
| `user_id` | The logged in account that triggered the event. Matches `users.csv`. Blank when the visitor was not logged in. |
| `anon_id` | Browser id for visitors who were not logged in. Blank when `user_id` is set. Anonymous ids are not linked to accounts, except that in a visit where someone signs up, the events before the signup carry an `anon_id` and share a `session_id` with the new account's later events. |
| `session_id` | One visit. A session ends after 30 minutes without activity. |
| `timestamp` | When the event happened. |
| `path` | The page the event happened on, such as `/`, `/resources`, `/hackathon`, `/game`. |
| `event` | The event type. See the table below. |
| `detail` | Extra context. For `search` it is the text typed in the search box. For `resource_click` it is the resource title. For `category_open` it is the category title. For `video_open` and `video_exit` it is the video title. Blank otherwise. |
| `results_count` | For `search` only: how many results the page showed for that query. Blank otherwise. |
| `seconds` | For `video_exit` only: seconds between opening the video and leaving it (closing the video tab or coming back to the Resources page). Blank otherwise. |
| `device` | `desktop` or `mobile`. |

### Event types

| Event | Meaning |
| --- | --- |
| `page_view` | A page loaded. On `/resources` this means the full, unlocked library was shown. |
| `locked_view` | Someone opened `/resources` but saw the members only lock screen instead of the library. |
| `search` | A query was typed into the search box on `/resources`. |
| `category_open` | A resource category card was opened on `/resources`. |
| `resource_click` | The Open button on a resource card was clicked. |
| `video_open` | A video in the Practice Interviews section on `/resources` was opened. |
| `video_exit` | The viewer left a video they opened. |
| `signup` | A new account was created on `/auth`. |
| `login` | An existing account logged in on `/auth`. |

## users.csv

One row per account, including accounts created before the data window.

| Column | Meaning |
| --- | --- |
| `user_id` | Unique id for the account. Matches `events.csv` and `feedback.csv`. |
| `signup_at` | When the account was created. |
| `class_year` | Self reported class year: Freshman, Sophomore, Junior, Senior, or Graduate. |
| `major` | Self reported major. |
| `email_domain` | Domain of the email used to sign up. |
| `confirmed_at` | When the account's email address was confirmed. Blank if never confirmed. |
| `member_approved_at` | When the account was granted PMA member access, which unlocks `/resources`. Blank if it has not been granted. |
| `last_seen_at` | The most recent time the account was active on the site. Can be before Oct 11 for accounts with no activity in the window. |
| `sessions_30d` | Number of sessions the account had between Oct 11 and Nov 9. |

## feedback.csv

Feedback collected between Oct 11 and Nov 9.

| Column | Meaning |
| --- | --- |
| `feedback_id` | Unique id for the feedback row. |
| `user_id` | The account that sent it. Blank when an email could not be matched to an account. |
| `submitted_at` | When it was submitted. |
| `page` | `/resources` for the rating form at the bottom of the Resources page (only members can see it). `email` for messages sent to the club inbox that officers copied into this log. |
| `rating` | 1 (not helpful) to 5 (very helpful) from the rating form. Blank for email rows. |
| `comment` | The text the person wrote. Can be blank. |

## interviews/

Five transcripts of short user interviews with BYU students, run by a PMA product manager in the week of Nov 2. Names are changed. Interviewees are not identified in the other files.
