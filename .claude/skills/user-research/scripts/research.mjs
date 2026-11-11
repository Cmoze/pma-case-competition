#!/usr/bin/env node
// What users say: case-kit/feedback.csv and case-kit/interviews/*.md.
// Usage: node .claude/skills/user-research/scripts/research.mjs <command> [flags]
import fs from "node:fs";
import path from "node:path";
import {
  load, usersById, weekOf, weekLabel, weekKeys, args, list, pct, table, heading, source, note,
  normPath, KIT,
} from "../../case-data-map/scripts/lib.mjs";

const a = args();
if (a.page && a.page !== true) a.page = list(a.page).map((v) => (/email/i.test(v) ? "email" : normPath(v)[0]));
const cmd = a._[0];
const fb = load("feedback");
const users = usersById();

const HELP = `Commands (verbatim text, counts and source ids; markdown output):
  summary
      Feedback volume by channel and week, rating distribution, blank comments, repeat submitters, submitter class years.
  feedback [--grep REGEX] [--page /resources|email] [--rating 1,2] [--user u_0123] [--week W2] [--with-comment]
      Matching feedback rows, verbatim, with counts of rows and distinct users.
  themes --theme "label=REGEX" [--theme "label2=REGEX2" ...] [--show-unmatched]
      Rows, distinct users, channel split, average rating and interview mentions per theme you define.
  interviews [--grep REGEX] [--speaker NAME]
      No grep: who was interviewed. With grep: matching lines with file:line and speaker.
  quotes --grep REGEX
      Verbatim matches across both feedback.csv and interviews, with sources.
REGEX is case-insensitive JavaScript regex, e.g. "search|no results".`;

const rx = (s) => new RegExp(String(s), "i");
const csv = (v) => list(v).flatMap((x) => String(x).split(","));

function submitter(f) { return f.user_id || `(unmatched email ${f.feedback_id})`; }

function readInterviews() {
  const dir = path.join(KIT, "interviews");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((file) => {
    const lines = fs.readFileSync(path.join(dir, file), "utf8").split(/\r?\n/);
    return { file: `case-kit/interviews/${file}`, title: lines[0].replace(/^#\s*/, ""), profile: lines.find((l, i) => i > 0 && l.trim()) || "", lines };
  });
}

function speakerOf(line) {
  const m = line.match(/^\*\*(.+?):\*\*/);
  return m ? m[1] : "";
}

function summary() {
  heading(`Feedback rows by channel and week (${fb.length} rows total)`);
  const wk = weekKeys(true);
  table(["page", ...wk.map(weekLabel), "Total rows", "Distinct submitters"], ["/resources", "email"].map((p) => {
    const r = fb.filter((f) => f.page === p);
    return [p, ...wk.map((w) => r.filter((f) => weekOf(f.submitted_at) === w).length), r.length, new Set(r.map(submitter)).size];
  }));

  const rated = fb.filter((f) => f.rating);
  heading(`Ratings on the /resources form (${rated.length} rated rows)`);
  table(["Rating", "Rows", "Share", "Distinct users"], ["1", "2", "3", "4", "5"].map((r) => {
    const x = rated.filter((f) => f.rating === r);
    return [r, x.length, pct(x.length, rated.length), new Set(x.map((f) => f.user_id)).size];
  }));
  table(["Week", "Rated rows", "Average rating"], wk.map((w) => {
    const x = rated.filter((f) => weekOf(f.submitted_at) === w);
    return [weekLabel(w), x.length, x.length ? (x.reduce((s, f) => s + Number(f.rating), 0) / x.length).toFixed(2) : ""];
  }));

  const blank = fb.filter((f) => !f.comment.trim()).length;
  heading("Comment coverage");
  table(["Rows with a comment", "Rows with blank comment", "Email rows with no matched user_id"],
    [[fb.length - blank, blank, fb.filter((f) => f.page === "email" && !f.user_id).length]]);

  const per = new Map();
  for (const f of fb) per.set(submitter(f), (per.get(submitter(f)) || 0) + 1);
  const repeat = [...per.entries()].filter(([, n]) => n >= 3).sort((x, y) => y[1] - x[1]);
  heading(`Repeat submitters (3+ rows): ${repeat.length} people wrote ${repeat.reduce((s, [, n]) => s + n, 0)} of ${fb.length} rows`);
  table(["user_id", "Rows", "class_year", "Comments (verbatim, ' // ' separated)"], repeat.map(([u, n]) => [
    u, n, users.get(u)?.class_year || "",
    fb.filter((f) => submitter(f) === u).map((f) => f.comment || "(blank)").join(" // "),
  ]));

  const cy = new Map();
  for (const u of new Set(fb.map((f) => f.user_id).filter(Boolean))) {
    const k = users.get(u)?.class_year || "(not in users.csv)";
    cy.set(k, (cy.get(k) || 0) + 1);
  }
  heading("Distinct feedback submitters by class year");
  table(["class_year", "Distinct submitters"], [...cy.entries()].sort());
  source("case-kit/feedback.csv joined to case-kit/users.csv");
  note("Counts of rows are not counts of people. Check 'Distinct submitters' before saying 'many users'.");
}

function filtered() {
  return fb.filter((f) =>
    (!a.grep || rx(a.grep).test(f.comment)) &&
    (!a.page || list(a.page).includes(f.page)) &&
    (!a.rating || csv(a.rating).includes(f.rating)) &&
    (!a.user || csv(a.user).includes(f.user_id)) &&
    (!a.week || csv(a.week).includes(weekOf(f.submitted_at))) &&
    (!a["with-comment"] || f.comment.trim()));
}

function feedback() {
  const rows = filtered();
  const people = new Set(rows.map(submitter));
  const rated = rows.filter((f) => f.rating);
  const avg = rated.length ? (rated.reduce((s, f) => s + Number(f.rating), 0) / rated.length).toFixed(2) : "n/a";
  heading(`Feedback rows matching ${describe()}: ${rows.length} rows from ${people.size} distinct submitters (avg rating ${avg} over ${rated.length} rated rows)`);
  table(["feedback_id", "user_id", "class_year", "submitted_at", "page", "rating", "comment (verbatim)"],
    rows.map((f) => [f.feedback_id, f.user_id, users.get(f.user_id)?.class_year || "", f.submitted_at, f.page, f.rating, f.comment]));
  source("case-kit/feedback.csv");
}

function describe() {
  const p = ["grep", "page", "rating", "user", "week"].filter((k) => a[k]).map((k) => `${k}=${list(a[k]).join(",")}`);
  return p.length ? p.join(", ") : "all rows";
}

function themes() {
  const defs = list(a.theme).map((t) => {
    const i = String(t).indexOf("=");
    return { label: String(t).slice(0, i).trim(), re: rx(String(t).slice(i + 1)) };
  });
  if (!defs.length) { console.log('themes needs at least one --theme "label=REGEX"'); return; }
  const ivs = readInterviews();
  const matched = new Set();
  const rows = defs.map((d) => {
    const r = fb.filter((f) => d.re.test(f.comment));
    r.forEach((f) => matched.add(f.feedback_id));
    const rated = r.filter((f) => f.rating);
    const ivHits = ivs.map((iv) => [iv, iv.lines.filter((l) => speakerOf(l) && speakerOf(l) !== "PMA PM" && d.re.test(l)).length]).filter(([, n]) => n);
    const per = new Map();
    for (const f of r) per.set(submitter(f), (per.get(submitter(f)) || 0) + 1);
    const top = [...per.values()].sort((x, y) => y - x)[0] || 0;
    return [d.label, r.length, per.size, top, r.filter((f) => f.page === "/resources").length, r.filter((f) => f.page === "email").length,
      rated.length ? (rated.reduce((s, f) => s + Number(f.rating), 0) / rated.length).toFixed(2) : "",
      ivHits.map(([iv, n]) => `${iv.title.replace(/^Interview \d+:\s*/, "")} (${n})`).join(", ")];
  });
  heading("Themes (regex match on comment text; interviewee lines only)");
  table(["Theme", "Feedback rows", "Distinct submitters", "Most rows from one submitter", "/resources rows", "email rows", "Avg rating", "Interviewees mentioning (lines)"], rows);
  for (const d of defs) {
    const r = fb.filter((f) => d.re.test(f.comment));
    heading(`${d.label}: verbatim rows`);
    table(["feedback_id", "user_id", "page", "rating", "comment"], r.map((f) => [f.feedback_id, f.user_id, f.page, f.rating, f.comment]));
  }
  const un = fb.filter((f) => f.comment.trim() && !matched.has(f.feedback_id));
  heading(`Rows with a comment that matched no theme: ${un.length}`);
  if (a["show-unmatched"]) table(["feedback_id", "user_id", "page", "rating", "comment"], un.map((f) => [f.feedback_id, f.user_id, f.page, f.rating, f.comment]));
  else console.log("(add --show-unmatched to list them)\n");
  source("case-kit/feedback.csv, case-kit/interviews/*.md");
  note("Regex themes are a first pass. A row can match several themes. Read the verbatim rows to check each match, and compare 'Feedback rows' with 'Distinct submitters' since some people wrote many rows.");
}

function interviews() {
  const ivs = readInterviews();
  if (!a.grep) {
    heading(`Interviews (${ivs.length})`);
    table(["File", "Title", "Profile line (verbatim)"], ivs.map((iv) => [iv.file, iv.title, iv.profile]));
    source("case-kit/interviews/*.md");
    note("Interviews were run in the week of Nov 2 by a PMA PM. Names are changed and interviewees cannot be linked to users.csv, events.csv or feedback.csv.");
    return;
  }
  const re = rx(a.grep);
  const out = [];
  for (const iv of ivs) {
    iv.lines.forEach((l, i) => {
      const sp = speakerOf(l);
      if (!sp || !re.test(l)) return;
      if (a.speaker && !rx(a.speaker).test(sp)) return;
      out.push([`${iv.file}:${i + 1}`, sp, l.replace(/^\*\*.+?:\*\*\s*/, "")]);
    });
  }
  heading(`Interview lines matching /${a.grep}/i: ${out.length} lines in ${new Set(out.map((r) => r[0].split(":")[0])).size} interviews`);
  table(["Source (file:line)", "Speaker", "Line (verbatim)"], out);
  source("case-kit/interviews/*.md");
}

function quotes() {
  if (!a.grep) { console.log("quotes needs --grep REGEX"); return; }
  feedback();
  interviews();
}

const commands = { summary, feedback, themes, interviews, quotes };
if (!commands[cmd]) console.log(HELP);
else commands[cmd]();
