#!/usr/bin/env node
// Engagement and usage metrics from case-kit/events.csv (joined to users.csv).
// Usage: node .claude/skills/engagement-metrics/scripts/metrics.mjs <command> [flags]
// Run with no command to see help.
import {
  load, usersById, weekOf, weekLabel, weekKeys, args, list, pct, median,
  table, heading, source, note, northStarSets, userType, memberTenure, USER_FIELDS, normPath, videoCatalog,
} from "../../case-data-map/scripts/lib.mjs";

const a = args();
a.path = normPath(a.path);
const cmd = a._[0];
const includePartial = Boolean(a["include-partial"]);
const weeks = weekKeys(includePartial);
const users = usersById();
const events = load("events");

const HELP = `Commands (all print markdown tables with a source line):
  north-star [--by device|class_year|major|tenure] [--include-partial]
      Weekly active members on /resources (distinct user_id with page_view on /resources).
  weekly [--event E] [--path P] [--device D] [--by FIELD] [--include-partial]
      Events, distinct users, distinct sessions per week for any filter.
      FIELD: event, path, device, user_type, class_year, major, tenure, detail
  pages [--event page_view] [--include-partial]
      Event counts per path per week.
  top --event E [--field detail] [--path P] [--limit 30]
      Most common values of a field for one event type, with distinct users.
  searches [--limit 40]
      Search queries, results shown, zero-result share, and what the same session did next.
  videos
      Practice interview video opens and how long viewers stayed (video_exit seconds).
  clicks
      resource_click and category_open counts by title, by week.
Flags: --include-partial adds W5 (Nov 8-9, only two days).`;

const csvList = (v) => list(v).flatMap((x) => String(x).split(","));
function filterEvents(f = {}) {
  return events.filter((e) =>
    (!f.event || csvList(f.event).includes(e.event)) &&
    (!f.path || list(f.path).includes(e.path)) &&
    (!f.device || list(f.device).includes(e.device)));
}

function segValue(e, by) {
  if (!by) return "all";
  if (by === "user_type") return userType(e, users);
  if (by === "tenure") return e.user_id ? memberTenure(users.get(e.user_id)) : "anonymous";
  if (USER_FIELDS.includes(by)) return e.user_id ? users.get(e.user_id)?.[by] || "(blank)" : "anonymous";
  return e[by] || "(blank)";
}

function filterDesc(f) {
  const parts = ["event", "path", "device"].filter((k) => f[k]).map((k) => `${k}=${list(f[k]).join(",")}`);
  return parts.length ? parts.join(", ") : "all events";
}

function northStar() {
  const by = a.by;
  const sets = northStarSets();
  heading(`North star: weekly active members on /resources${by ? ` by ${by}` : ""}`);
  if (!by) {
    const rows = weeks.map((w, i) => {
      const n = sets.get(w).size;
      const prev = i ? sets.get(weeks[i - 1]).size : null;
      return [weekLabel(w), n, prev === null ? "" : `${n - prev >= 0 ? "+" : ""}${n - prev}`];
    });
    table(["Week", "Active members", "Change vs prior week"], rows);
  } else {
    const counts = new Map();
    for (const e of events) {
      if (e.event !== "page_view" || e.path !== "/resources" || !e.user_id) continue;
      const w = weekOf(e.timestamp);
      if (!weeks.includes(w)) continue;
      const v = by === "device" ? e.device : by === "tenure" ? memberTenure(users.get(e.user_id)) : users.get(e.user_id)?.[by] || "(blank)";
      if (!counts.has(v)) counts.set(v, new Map(weeks.map((k) => [k, new Set()])));
      counts.get(v).get(w).add(e.user_id);
    }
    const rows = [...counts.entries()].sort().map(([v, m]) => [v, ...weeks.map((w) => m.get(w).size)]);
    rows.push(["Total distinct", ...weeks.map((w) => sets.get(w).size)]);
    table([by, ...weeks.map(weekLabel)], rows);
    if (by === "device") note("A member who used both devices in a week is counted in both rows, so rows can add up to more than the total.");
  }
  source("case-kit/events.csv (event=page_view, path=/resources, user_id not blank)" + (by && by !== "device" ? " joined to case-kit/users.csv" : ""));
  note("Brief reports 41, 33, 30, 23 for W1-W4. W5 is only 2 days; leave it out of week-over-week comparisons.");
}

function weekly() {
  const f = { event: a.event, path: a.path, device: a.device };
  const by = a.by;
  const rows = [];
  const groups = new Map();
  for (const e of filterEvents(f)) {
    const w = weekOf(e.timestamp);
    if (!weeks.includes(w)) continue;
    const v = segValue(e, by);
    if (!groups.has(v)) groups.set(v, new Map(weeks.map((k) => [k, { n: 0, u: new Set(), s: new Set(), anon: new Set() }])));
    const g = groups.get(v).get(w);
    g.n++; g.s.add(e.session_id);
    if (e.user_id) g.u.add(e.user_id); else if (e.anon_id) g.anon.add(e.anon_id);
  }
  heading(`Weekly ${filterDesc(f)}${by ? ` by ${by}` : ""}`);
  for (const [v, m] of [...groups.entries()].sort((x, y) => String(x[0]).localeCompare(String(y[0])))) {
    for (const w of weeks) {
      const g = m.get(w);
      rows.push([...(by ? [v] : []), weekLabel(w), g.n, g.u.size, g.anon.size, g.s.size]);
    }
  }
  table([...(by ? [by] : []), "Week", "Events", "Distinct logged-in users", "Distinct anon ids", "Distinct sessions"], rows);
  source(`case-kit/events.csv (${filterDesc(f)})${by && (USER_FIELDS.includes(by) || by === "tenure" || by === "user_type") ? " joined to case-kit/users.csv" : ""}`);
  if (by === "user_type") note("user_type is computed at event time: member means users.member_approved_at is on or before the event timestamp.");
  note("Anonymous ids are per browser and are not linked to accounts (except within a signup session), so distinct anon ids are not distinct people.");
}

function pages() {
  const ev = a.event || "page_view";
  const m = new Map();
  for (const e of events) {
    if (e.event !== ev) continue;
    const w = weekOf(e.timestamp);
    if (!weeks.includes(w)) continue;
    if (!m.has(e.path)) m.set(e.path, Object.fromEntries(weeks.map((k) => [k, 0])));
    m.get(e.path)[w]++;
  }
  heading(`${ev} events per path per week`);
  const rows = [...m.entries()].map(([p, c]) => [p, ...weeks.map((w) => c[w]), weeks.reduce((s, w) => s + c[w], 0)]);
  rows.sort((x, y) => y[y.length - 1] - x[x.length - 1]);
  table(["Path", ...weeks.map(weekLabel), "Total"], rows);
  source(`case-kit/events.csv (event=${ev})`);
  note("Counts are events, not people. Use `weekly --path P --event E` for distinct users and sessions. On /resources, page_view means the unlocked library loaded; locked_view is the lock screen.");
}

function top() {
  if (!a.event) { console.log("top needs --event, e.g. --event search"); return; }
  const field = a.field || "detail";
  const limit = Number(a.limit || 30);
  const m = new Map();
  for (const e of filterEvents({ event: a.event, path: a.path })) {
    const v = e[field] || "(blank)";
    if (!m.has(v)) m.set(v, { n: 0, u: new Set(), s: new Set() });
    const g = m.get(v); g.n++; g.s.add(e.session_id); g.u.add(e.user_id || `anon:${e.anon_id}`);
  }
  const total = [...m.values()].reduce((s, g) => s + g.n, 0);
  heading(`Top ${field} values for event=${a.event}${a.path ? ` on ${a.path}` : ""} (${total} events, ${m.size} distinct values)`);
  const rows = [...m.entries()].sort((x, y) => y[1].n - x[1].n).slice(0, limit)
    .map(([v, g]) => [v, g.n, pct(g.n, total), g.u.size, g.s.size]);
  table([field, "Events", "Share", "Distinct visitors", "Distinct sessions"], rows);
  source(`case-kit/events.csv (event=${a.event})`);
}

function sessionsIndex() {
  const bySession = new Map();
  for (const e of events) {
    if (!bySession.has(e.session_id)) bySession.set(e.session_id, []);
    bySession.get(e.session_id).push(e);
  }
  return bySession;
}

function nextAfter(list, e) {
  const i = list.indexOf(e);
  return list.slice(i + 1);
}

function searches() {
  const limit = Number(a.limit || 40);
  const s = events.filter((e) => e.event === "search");
  const bySession = sessionsIndex();
  const outcome = (e) => {
    const after = nextAfter(bySession.get(e.session_id), e);
    if (!after.length) return "session ended";
    const n = after[0];
    return n.event === "page_view" ? `page_view ${n.path}` : n.event;
  };
  const q = new Map();
  for (const e of s) {
    const k = e.detail.trim().toLowerCase();
    if (!q.has(k)) q.set(k, { n: 0, zero: 0, results: new Set(), u: new Set() });
    const g = q.get(k); g.n++; g.u.add(e.user_id || `anon:${e.anon_id}`);
    g.results.add(e.results_count);
    if (e.results_count === "0") g.zero++;
  }
  heading(`Search queries on /resources (${s.length} searches, ${q.size} distinct queries)`);
  table(["Query", "Searches", "Distinct searchers", "results_count shown", "Zero-result searches"],
    [...q.entries()].sort((x, y) => y[1].n - x[1].n).slice(0, limit)
      .map(([k, g]) => [k, g.n, g.u.size, [...g.results].sort((x, y) => x - y).join(", "), g.zero]));

  heading("Searches by week");
  table(["Week", "Searches", "Zero-result", "Zero-result share", "Distinct searchers"],
    weekKeys(true).map((w) => {
      const ws = s.filter((e) => weekOf(e.timestamp) === w);
      const z = ws.filter((e) => e.results_count === "0").length;
      return [weekLabel(w), ws.length, z, pct(z, ws.length), new Set(ws.map((e) => e.user_id || `anon:${e.anon_id}`)).size];
    }));

  heading("What the same session did right after a search");
  const out = new Map();
  for (const e of s) {
    const key = `${e.results_count === "0" ? "0 results" : "1+ results"}|${outcome(e)}`;
    out.set(key, (out.get(key) || 0) + 1);
  }
  table(["Search result", "Next event in session", "Searches"],
    [...out.entries()].sort((x, y) => y[1] - x[1]).map(([k, n]) => [...k.split("|"), n]));
  source("case-kit/events.csv (event=search; detail = query text, results_count = results shown; next event = following row with the same session_id)");
  note("Queries are grouped after trimming and lowercasing only. Misspellings (e.g. 'behavorial') stay separate. 'Next event' is the immediately following event in the same session; a later search in the same session counts as 'search'.");
}

function videos() {
  const opens = events.filter((e) => e.event === "video_open");
  const exits = events.filter((e) => e.event === "video_exit");
  const m = new Map();
  for (const e of opens) {
    if (!m.has(e.detail)) m.set(e.detail, { opens: 0, viewers: new Set(), secs: [] });
    const g = m.get(e.detail); g.opens++; g.viewers.add(e.user_id || `anon:${e.anon_id}`);
  }
  for (const e of exits) {
    if (!m.has(e.detail)) m.set(e.detail, { opens: 0, viewers: new Set(), secs: [] });
    m.get(e.detail).secs.push(Number(e.seconds));
  }
  const cat = videoCatalog();
  heading(`Practice interview videos (${opens.length} opens, ${exits.length} exits)`);
  table(["Video title", "Topic tab*", "Length min*", "Start here*", "Opens", "Distinct viewers", "Exits", "Median seconds before exit", "Min s", "Max s"],
    [...m.entries()].sort((x, y) => y[1].opens - x[1].opens).map(([t, g]) => [
      t, cat.get(t)?.topic ?? "?", cat.get(t)?.minutes ?? "?", cat.get(t)?.startHere ? "yes" : "", g.opens, g.viewers.size, g.secs.length,
      Number.isFinite(median(g.secs)) ? Math.round(median(g.secs)) : "",
      g.secs.length ? Math.min(...g.secs) : "", g.secs.length ? Math.max(...g.secs) : "",
    ]));
  heading("Opens by topic tab* and length*");
  const tg = new Map();
  for (const e of opens) {
    const c = cat.get(e.detail);
    const k = `${c?.topic ?? "?"}|${c ? (c.minutes >= 20 ? "20+ min" : c.minutes >= 10 ? "10-19 min" : "under 10 min") : "?"}`;
    if (!tg.has(k)) tg.set(k, { n: 0, secs: [] });
    tg.get(k).n++;
  }
  for (const e of exits) {
    const c = cat.get(e.detail);
    const k = `${c?.topic ?? "?"}|${c ? (c.minutes >= 20 ? "20+ min" : c.minutes >= 10 ? "10-19 min" : "under 10 min") : "?"}`;
    if (tg.has(k)) tg.get(k).secs.push(Number(e.seconds));
  }
  table(["Topic tab*", "Video length*", "Opens", "Median seconds before exit", "Exits under 60 s"],
    [...tg.entries()].sort().map(([k, g]) => [...k.split("|"), g.n, Math.round(median(g.secs)), g.secs.filter((x) => x < 60).length]));
  const buckets = [["under 30 s", 0, 30], ["30 s to 2 min", 30, 120], ["2 to 10 min", 120, 600], ["10 to 20 min", 600, 1200], ["20 min or more", 1200, Infinity]];
  const secs = exits.map((e) => Number(e.seconds));
  heading("Distribution of time before video_exit (all videos)");
  table(["Time watched before exit", "Exits", "Share"],
    buckets.map(([l, lo, hi]) => { const n = secs.filter((x) => x >= lo && x < hi).length; return [l, n, pct(n, secs.length)]; }));
  heading("Video opens by week");
  table(["Week", "Opens", "Distinct viewers"], weekKeys(true).map((w) => {
    const o = opens.filter((e) => weekOf(e.timestamp) === w);
    return [weekLabel(w), o.length, new Set(o.map((e) => e.user_id || e.anon_id)).size];
  }));
  source("case-kit/events.csv (event=video_open / video_exit; detail = video title; seconds = time from open to exit)");
  note("seconds is time between opening and leaving, not confirmed watch time. *Topic, length and Start here are read from src/lib/videoLibrary.ts (the site source), not from the case kit; they describe the library today and may not match what was live in October.");
}

function clicks() {
  for (const ev of ["category_open", "resource_click"]) {
    const m = new Map();
    for (const e of events) {
      if (e.event !== ev) continue;
      const w = weekOf(e.timestamp);
      if (!m.has(e.detail)) m.set(e.detail, { ...Object.fromEntries(weekKeys(true).map((k) => [k, 0])), u: new Set() });
      m.get(e.detail)[w]++;
      m.get(e.detail).u.add(e.user_id || `anon:${e.anon_id}`);
    }
    heading(`${ev} by title and week`);
    const rows = [...m.entries()].map(([t, c]) => [t, ...weekKeys(true).map((w) => c[w]), weekKeys(true).reduce((s, w) => s + c[w], 0), c.u.size]);
    rows.sort((x, y) => y[y.length - 2] - x[x.length - 2]);
    table(["Title", ...weekKeys(true).map(weekLabel), "Total", "Distinct users"], rows);
  }
  source("case-kit/events.csv (event=category_open / resource_click; detail = category or resource title)");
  note("W5 is a 2-day partial week.");
}

const commands = { "north-star": northStar, weekly, pages, top, searches, videos, clicks };
if (!commands[cmd]) console.log(HELP);
else commands[cmd]();
