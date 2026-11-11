#!/usr/bin/env node
// Accounts, membership funnel, cohorts and retention from case-kit/users.csv + events.csv.
// Usage: node .claude/skills/member-segments/scripts/segments.mjs <command> [flags]
import {
  load, usersById, weekOf, weekLabel, weekKeys, args, pct, median, ms, localDate,
  table, heading, source, note, northStarSets, memberTenure, WINDOW_START, normPath,
} from "../../case-data-map/scripts/lib.mjs";

const a = args();
const cmd = a._[0];
const users = load("users");
const byId = usersById();
const events = load("events");
const DAY = 86400000;
const END = Date.parse("2026-11-09T23:59:59-07:00");

const HELP = `Commands (markdown tables with a source line):
  accounts [--by class_year|major|tenure]
      All accounts: counts, confirmed, member, active in window.
  funnel [--by signup_week|class_year|major]
      Accounts created Oct 11 to Nov 9: signup -> email confirmed -> member approved -> unlocked /resources view.
  approval-lag
      Days from signup (and from email confirmation) to member approval, by signup week, plus accounts still waiting.
  retention
      North star members each week split into retained / new this window / reactivated, and who dropped off.
  return-after --event E [--zero-results] [--path P]
      For logged-in users who did event E in a week, did they have an unlocked /resources page_view in any LATER week?
  user <user_id>
      One account's users.csv row, its event timeline summary, and its feedback rows.`;

function accounts() {
  const by = a.by;
  const key = (u) => (by === "tenure" ? memberTenure(u) : by ? u[by] || "(blank)" : "all accounts");
  const g = new Map();
  for (const u of users) {
    const k = key(u);
    if (!g.has(k)) g.set(k, { n: 0, conf: 0, mem: 0, active: 0, s: [] });
    const x = g.get(k);
    x.n++; if (u.confirmed_at) x.conf++; if (u.member_approved_at) x.mem++;
    if (Number(u.sessions_30d) > 0) x.active++; x.s.push(Number(u.sessions_30d));
  }
  heading(`Accounts${by ? ` by ${by}` : ""}`);
  table([by || "group", "Accounts", "Email confirmed", "Member approved", "Any session Oct 11-Nov 9", "Median sessions_30d"],
    [...g.entries()].sort().map(([k, x]) => [k, x.n, x.conf, x.mem, `${x.active} (${pct(x.active, x.n)})`, median(x.s)]));
  source("case-kit/users.csv (sessions_30d = sessions Oct 11 to Nov 9)");
}

function funnel() {
  const by = a.by || "signup_week";
  const inWindow = users.filter((u) => localDate(u.signup_at) >= WINDOW_START);
  const unlocked = new Set(events.filter((e) => e.event === "page_view" && e.path === "/resources" && e.user_id).map((e) => e.user_id));
  const locked = new Set(events.filter((e) => e.event === "locked_view" && e.user_id).map((e) => e.user_id));
  const key = (u) => (by === "signup_week" ? weekLabel(weekOf(u.signup_at)) : u[by] || "(blank)");
  const g = new Map();
  for (const u of inWindow) {
    const k = key(u);
    if (!g.has(k)) g.set(k, { n: 0, conf: 0, mem: 0, unl: 0, lock: 0 });
    const x = g.get(k);
    x.n++; if (u.confirmed_at) x.conf++; if (u.member_approved_at) x.mem++;
    if (unlocked.has(u.user_id)) x.unl++; if (locked.has(u.user_id)) x.lock++;
  }
  const rows = [...g.entries()].sort().map(([k, x]) => [k, x.n, `${x.conf} (${pct(x.conf, x.n)})`, `${x.lock} (${pct(x.lock, x.n)})`, `${x.mem} (${pct(x.mem, x.n)})`, `${x.unl} (${pct(x.unl, x.n)})`]);
  const t = [...g.values()].reduce((s, x) => ({ n: s.n + x.n, conf: s.conf + x.conf, mem: s.mem + x.mem, unl: s.unl + x.unl, lock: s.lock + x.lock }), { n: 0, conf: 0, mem: 0, unl: 0, lock: 0 });
  rows.push(["Total", t.n, `${t.conf} (${pct(t.conf, t.n)})`, `${t.lock} (${pct(t.lock, t.n)})`, `${t.mem} (${pct(t.mem, t.n)})`, `${t.unl} (${pct(t.unl, t.n)})`]);
  heading(`New-account funnel, accounts created Oct 11 to Nov 9, by ${by}`);
  table([by, "Signed up", "Email confirmed", "Saw lock screen (logged in)", "Member approved by Nov 9", "Saw unlocked /resources"], rows);
  source("case-kit/users.csv (signup_at, confirmed_at, member_approved_at) + case-kit/events.csv (locked_view / page_view on /resources by user_id)");
  note("Later signup weeks have had less time to be approved, so compare them with care. 'Saw lock screen' only counts logged-in locked_view events; lock screens seen before signing up carry an anon_id.");
}

function approvalLag() {
  const inWindow = users.filter((u) => localDate(u.signup_at) >= WINDOW_START);
  const rows = [];
  for (const w of weekKeys(true)) {
    const us = inWindow.filter((u) => weekOf(u.signup_at) === w);
    const lags = us.filter((u) => u.member_approved_at).map((u) => (ms(u.member_approved_at) - ms(u.signup_at)) / DAY);
    const conf = us.filter((u) => u.member_approved_at && u.confirmed_at).map((u) => (ms(u.member_approved_at) - ms(u.confirmed_at)) / DAY);
    const pending = us.filter((u) => !u.member_approved_at);
    const waits = pending.map((u) => (END - ms(u.signup_at)) / DAY);
    rows.push([weekLabel(w), us.length, lags.length, lags.length ? median(lags).toFixed(1) : "",
      lags.length ? Math.min(...lags).toFixed(1) : "", lags.length ? Math.max(...lags).toFixed(1) : "",
      conf.length ? median(conf).toFixed(1) : "", pending.length, waits.length ? median(waits).toFixed(1) : ""]);
  }
  heading("Days from signup to member approval, accounts created Oct 11 to Nov 9");
  table(["Signup week", "Signed up", "Approved", "Median days signup->approved", "Min", "Max", "Median days confirmed->approved", "Not approved by Nov 9", "Median days waiting so far (as of Nov 9)"], rows);

  const older = users.filter((u) => localDate(u.signup_at) < WINDOW_START && u.member_approved_at);
  const olderLags = older.map((u) => (ms(u.member_approved_at) - ms(u.signup_at)) / DAY);
  heading("For comparison: accounts created before Oct 11 that were approved");
  table(["Accounts", "Median days signup->approved", "Min", "Max"],
    [[older.length, median(olderLags).toFixed(1), Math.min(...olderLags).toFixed(1), Math.max(...olderLags).toFixed(1)]]);

  const approvedByWeek = weekKeys(true).map((w) => [weekLabel(w), users.filter((u) => weekOf(u.member_approved_at) === w).length]);
  heading("Member approvals granted per week (any signup date)");
  table(["Week", "Approvals"], approvedByWeek);
  source("case-kit/users.csv (signup_at, confirmed_at, member_approved_at)");
  note("The data shows when approval happened, not why it took that long or who approved it. Accounts not approved by Nov 9 are measured to the end of the data (Nov 9 23:59).");
}

function retention() {
  const sets = northStarSets();
  const weeks = weekKeys(false);
  const seen = new Set();
  const rows = [];
  weeks.forEach((w, i) => {
    const cur = sets.get(w);
    const prev = i ? sets.get(weeks[i - 1]) : new Set();
    let retained = 0, react = 0, fresh = 0;
    for (const u of cur) {
      if (prev.has(u)) retained++;
      else if (seen.has(u)) react++;
      else fresh++;
    }
    const dropped = [...prev].filter((u) => !cur.has(u)).length;
    rows.push([weekLabel(w), cur.size, i ? retained : "", i ? react : "", i ? fresh : cur.size, i ? dropped : ""]);
    for (const u of cur) seen.add(u);
  });
  heading("North star members: retained vs new vs reactivated, week over week");
  table(["Week", "Active members", "Also active prior week", "Back after a gap", "First active week in data", "Active prior week but not this week"], rows);

  const w1 = sets.get("W1");
  heading("W1 active members: which later weeks were they active?");
  table(["Week", "Of W1 members, active this week", "Share"], weeks.slice(1).map((w) => {
    const n = [...w1].filter((u) => sets.get(w).has(u)).length;
    return [weekLabel(w), n, pct(n, w1.size)];
  }));
  source("case-kit/events.csv (page_view on /resources by user_id), Oct 11 to Nov 7");
  note("'First active week in data' only means first in this 30-day window; the user may have used /resources before Oct 11.");
}

function returnAfter() {
  if (!a.event) { console.log("return-after needs --event, e.g. --event search --zero-results"); return; }
  const sets = northStarSets();
  const weeks = weekKeys(true);
  const p = a.path ? normPath(a.path)[0] : undefined;
  const first = new Map();
  for (const e of events) {
    if (e.event !== a.event || !e.user_id) continue;
    if (p && e.path !== p) continue;
    if (a["zero-results"] && e.results_count !== "0") continue;
    if (!first.has(e.user_id)) first.set(e.user_id, e);
  }
  const rows = [];
  let total = 0, back = 0;
  for (const w of weekKeys(false)) {
    const us = [...first.entries()].filter(([, e]) => weekOf(e.timestamp) === w).map(([u]) => u);
    const later = weeks.slice(weeks.indexOf(w) + 1);
    const n = us.filter((u) => later.some((lw) => sets.get(lw).has(u))).length;
    total += us.length; back += n;
    rows.push([weekLabel(w), us.length, n, pct(n, us.length)]);
  }
  rows.push(["Total", total, back, pct(back, total)]);
  const desc = `event=${a.event}${p ? ` path=${p}` : ""}${a["zero-results"] ? " with results_count=0" : ""}`;
  heading(`Logged-in users whose first ${desc} was in week N: unlocked /resources page_view in a later week?`);
  table(["Week of first event", "Users", "Viewed /resources in a later week", "Share"], rows);
  source(`case-kit/events.csv (${desc}; later activity = page_view on /resources through Nov 9)`);
  note("Users from later weeks have fewer weeks left to return, so shares fall off naturally toward W4. Compare against a baseline, e.g. run the same command for another event or without --zero-results.");
}

function user() {
  const id = a._[1];
  const u = byId.get(id);
  if (!u) { console.log(`No user ${id} in case-kit/users.csv`); return; }
  heading(`Account ${id}`);
  table(Object.keys(u), [Object.values(u)]);
  const ev = events.filter((e) => e.user_id === id);
  const sessions = new Set(ev.map((e) => e.session_id));
  const anonIn = events.filter((e) => !e.user_id && sessions.has(e.session_id));
  heading(`Events (${ev.length} logged in, plus ${anonIn.length} pre-signup anon events in the same sessions)`);
  table(["timestamp", "path", "event", "detail", "results_count", "seconds", "device"],
    [...anonIn, ...ev].sort((x, y) => ms(x.timestamp) - ms(y.timestamp)).map((e) => [e.timestamp, e.path, e.event, e.detail, e.results_count, e.seconds, e.device]));
  const fb = load("feedback").filter((f) => f.user_id === id);
  heading(`Feedback rows (${fb.length})`);
  if (fb.length) table(["feedback_id", "submitted_at", "page", "rating", "comment"], fb.map((f) => [f.feedback_id, f.submitted_at, f.page, f.rating, f.comment]));
  source("case-kit/users.csv, case-kit/events.csv, case-kit/feedback.csv");
}

const commands = { accounts, funnel, "approval-lag": approvalLag, retention, "return-after": returnAfter, user };
if (!commands[cmd]) console.log(HELP);
else commands[cmd]();
