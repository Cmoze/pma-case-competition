// Shared, dependency-free helpers for the case kit skills.
// Node 18+ on Windows, macOS or Linux. Reads only files in case-kit/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// .claude/skills/case-data-map/scripts -> repo root
export const REPO_ROOT = path.resolve(here, "..", "..", "..", "..");
export const KIT = path.join(REPO_ROOT, "case-kit");

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

const cache = {};
export function load(name) {
  if (!cache[name]) {
    const file = path.join(KIT, `${name}.csv`);
    if (!fs.existsSync(file)) {
      console.error(`Missing ${file}. Run this from inside the pma-case-competition repo.`);
      process.exit(1);
    }
    cache[name] = parseCsv(fs.readFileSync(file, "utf8"));
  }
  return cache[name];
}

export function usersById() {
  return new Map(load("users").map((u) => [u.user_id, u]));
}

// Weeks run Sunday to Saturday in Utah local time. The local calendar date is
// the first 10 characters of each ISO timestamp, so no timezone math is needed.
export const WINDOW_START = "2026-10-11";
export const WEEKS = [
  { key: "W1", label: "Oct 11-17", start: "2026-10-11", end: "2026-10-17", partial: false },
  { key: "W2", label: "Oct 18-24", start: "2026-10-18", end: "2026-10-24", partial: false },
  { key: "W3", label: "Oct 25-31", start: "2026-10-25", end: "2026-10-31", partial: false },
  { key: "W4", label: "Nov 1-7", start: "2026-11-01", end: "2026-11-07", partial: false },
  { key: "W5", label: "Nov 8-9 (partial, 2 days)", start: "2026-11-08", end: "2026-11-09", partial: true },
];
export function localDate(ts) { return (ts || "").slice(0, 10); }
export function weekOf(ts) {
  const d = localDate(ts);
  if (!d) return null;
  const w = WEEKS.find((w) => d >= w.start && d <= w.end);
  if (w) return w.key;
  return d < WINDOW_START ? "before" : "after";
}
export function weekLabel(key) {
  const w = WEEKS.find((w) => w.key === key);
  return w ? `${w.key} ${w.label}` : key;
}
export function weekKeys(includePartial) {
  return WEEKS.filter((w) => includePartial || !w.partial).map((w) => w.key);
}
export function ms(ts) { return ts ? Date.parse(ts) : NaN; }

// Simple --flag value / --flag parser. Repeated flags become arrays.
export function args(argv = process.argv.slice(2)) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      const val = next === undefined || next.startsWith("--") ? true : (i++, next);
      if (key in out) out[key] = [].concat(out[key], val);
      else out[key] = val;
    } else out._.push(a);
  }
  return out;
}
export function list(v) { return v === undefined ? [] : [].concat(v); }

export function pct(n, d) { return d ? `${((100 * n) / d).toFixed(1)}%` : "n/a"; }
export function median(nums) {
  const a = nums.filter((n) => Number.isFinite(n)).sort((x, y) => x - y);
  if (!a.length) return NaN;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

export function table(headers, rows) {
  const esc = (v) => String(v ?? "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
  const lines = [
    `| ${headers.map(esc).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`),
  ];
  console.log(lines.join("\n"));
  console.log("");
}

export function heading(text) { console.log(`\n### ${text}\n`); }
export function source(text) { console.log(`_Source: ${text}_\n`); }
export function note(text) { console.log(`> Note: ${text}\n`); }

// North star: distinct logged in users with a page_view on /resources
// (page_view there means the unlocked library loaded) in each week.
export function northStarSets() {
  const sets = new Map(WEEKS.map((w) => [w.key, new Set()]));
  for (const e of load("events")) {
    if (e.event === "page_view" && e.path === "/resources" && e.user_id) {
      const w = weekOf(e.timestamp);
      if (sets.has(w)) sets.get(w).add(e.user_id);
    }
  }
  return sets;
}

// Who the visitor was at the moment of the event.
export function userType(e, users) {
  if (!e.user_id) return "anonymous";
  const u = users.get(e.user_id);
  if (!u) return "unknown account";
  if (u.member_approved_at && ms(u.member_approved_at) <= ms(e.timestamp)) return "member";
  return "logged in, not yet member";
}

// Segment value for one user (for --by flags that come from users.csv).
export const USER_FIELDS = ["class_year", "major", "email_domain"];
export function memberTenure(u) {
  if (!u || !u.member_approved_at) return "not a member";
  return localDate(u.member_approved_at) < WINDOW_START ? "member before Oct 11" : "became member Oct 11 or later";
}

// Git Bash on Windows rewrites "/resources" to "C:/Program Files/Git/resources".
// Undo that, and accept "resources" without the leading slash.
export function normPath(p) {
  if (p === undefined || p === true) return p;
  return [].concat(p).map((v) => {
    let s = String(v).split(String.fromCharCode(92)).join("/").replace(/^[A-Za-z]:\/.*?\/Git(?=\/)/, "");
    if (!s.startsWith("/")) s = "/" + s;
    return s;
  });
}

// Video metadata from the site source (not part of the case kit CSVs).
// Returns Map(title -> { topic, minutes, startHere }) or an empty Map if the file is missing.
export function videoCatalog() {
  const file = path.join(REPO_ROOT, "src", "lib", "videoLibrary.ts");
  const out = new Map();
  if (!fs.existsSync(file)) return out;
  let topic = "";
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const t = line.match(/^ {4}title: "(.+)"/);
    if (t) topic = t[1];
    const v = line.match(/title: "(.+?)", minutes: (\d+)(, startHere: true)?/);
    if (v) out.set(v[1], { topic, minutes: Number(v[2]), startHere: Boolean(v[3]) });
  }
  return out;
}
