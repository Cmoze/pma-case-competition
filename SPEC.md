# PM & CM: Free preview for members waiting on approval

Team: Parker Morris, Carter Moser

**Problem.** Paid members are locked out of /resources for days while an officer approves them by hand, and the page tells them nothing. This beats search, video overload and dark mode, which only touch users who already got in or have no data behind them.

**Evidence and size.** events.csv and users.csv, Oct 11 to Nov 9: 659 of 860 /resources sessions (77%) hit the lock. 136 logged-in accounts saw the lock, against 68 who ever saw the unlocked page. Median confirmed signup to approval is 5.0 days (90th percentile 11 days, n=240). "If it had said 'an officer will approve you within a week' I would have at least known to wait." (03-anjali.md)

**Spec.** For: anyone not yet approved, logged-in or not. Does: opens a free tier (one mock interview, 5 APM programs, behavioral and estimation starter, Cursor), shows the rest locked, and tells pending accounts approval takes up to a week. Not building: automatic approval or email alerts. Success metric: share of pending accounts returning within 7 days. Guardrail: Join (Pay Dues) clicks do not drop.

**Shipped.** /resources while logged out or pending.
