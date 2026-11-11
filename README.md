# PMA Case Interview: Build the Fix with AI

This is a practice copy of the BYU Product Management Association (PMA) website, built for Case Interview: Build the Fix with AI on Wednesday, November 11, 2026.

**The case:** engagement is slipping. You are the PM for this site. Use data, user interviews and AI to find out why, write a short spec, and ship a fix in one hour.

Everything you need is in this repo:

* The website itself, which runs on your laptop with no accounts or keys.
* The case kit in [`case-kit/`](case-kit): the brief, analytics data, feedback, and five user interviews.
* The attendee page at `/case` on the running site, with a one click download of the kit.

Start by reading [`case-kit/brief.md`](case-kit/brief.md). It explains the goal, the metric, and exactly what your team presents at the end.

This is not the official PMA site. Names, accounts and data in it are fictional.

## Two ways to work

Use whatever your team is comfortable with, or mix them.

### In a chat (ChatGPT, Claude, or Gemini)

No coding needed.

1. Open the demo site and click around like a student would. Sign in with the demo login below to see what members see.
2. Download the case kit: [`case-kit.zip`](public/case-kit.zip), or use the download button on the `/case` page.
3. Upload the CSV files and interviews to ChatGPT (it takes the zip) or Claude (unzip first).
4. Ask it questions. For example: "Summarize what is in these files", "Compute the weekly trend of the north star", "What do the interviews have in common?" Always ask the AI to show how it got a number, and check that it makes sense.
5. Pick the one cause you believe most, and write your spec.
6. Mock up your fix as a Claude artifact, or in Lovable or v0, and share the link.

### In the code (Claude Code, Codex, Cursor)

1. Fork this repo on GitHub (the Fork button at the top right).
2. Clone your fork and run `npm install` right away (see Quick start below).
3. Analyze the kit with any tools you like.
4. Build the fix with Claude Code, Codex, Cursor, or any editor. [`CLAUDE.md`](CLAUDE.md) gives coding agents the context they need.
   In Claude Code, three skills are ready: `/case-coach` asks you questions until you find the cause, `/write-spec` turns your findings into SPEC.md, and `/ship-pr` checks the build and opens your pull request.
5. Open a pull request against this repo (see How to submit a pull request).

## AI research skills

If you use Claude Code (or another agent that reads `.claude/skills`) in this repo, it already has four skills for the case kit: `case-data-map`, `engagement-metrics`, `user-research`, and `member-segments`. Ask things like "compute the north star by class year" or "what are users saying about search?", or type `/user-research`. They show data, quotes and sources; they do not make the decision for you. See [`.claude/skills/README.md`](.claude/skills/README.md).

## Quick start

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
git clone https://github.com/<your-username>/pma-case-competition.git
cd pma-case-competition
npm install
npm run dev
```

Open the address the terminal prints (usually http://localhost:8080).

### Demo login

| Email | Password | What you see |
| --- | --- | --- |
| `member@byu.edu` | `demo1234` | A PMA member: the unlocked Resources page |

You can also sign up with any `@byu.edu` address and a password of at least 6 characters. No email is sent. New accounts are not members yet, so they see the locked Resources page, just like on the real site.

## How the data works

There is no backend, no database server, and no environment variables.

* `src/lib/localDb` is a small stand in for a real backend. Pages call it the same way they would call a hosted database, for example `db.from("events").select().eq(...).order(...)` and `db.auth.signInWithPassword(...)`.
* On first load it copies the starting data from `src/lib/localDb/seed.ts` into your browser's localStorage. After that, every sign up, sign in, and change is saved in your browser only. Nobody else sees it.
* **To reset the demo**, clear the site's localStorage (in Chrome: DevTools, Application, Local Storage, right click the site, Clear) or open the site in a private window.
* To change the starting data, edit `seed.ts` and bump the version in the storage keys at the top of `src/lib/localDb/index.ts` (`pma-demo-db-v1` and `pma-demo-session-v1`) so browsers load the new data.

The case kit CSVs are separate from the site's demo data. They are the analytics export for the case.

## Repo map

| Path | What it is |
| --- | --- |
| `case-kit/` | The brief, data dictionary, CSVs, and interviews |
| `public/case-kit.zip` | Zipped copy of `case-kit/`, rebuilt on every build |
| `src/pages/` | One file per page, such as `ResourcesPage.tsx`, `EventsPage.tsx`, `CasePage.tsx` |
| `src/components/` | Shared pieces: navigation, footer, login popup, home sections, resources sections |
| `src/components/ui/` | shadcn/ui building blocks (buttons, dialogs, tabs) |
| `src/lib/resources.ts` | The resource library content |
| `src/lib/videoLibrary.ts` | Practice interview videos |
| `src/lib/apmPlaybook.ts` | APM playbook content |
| `src/lib/localDb/` | The in browser data layer and its seed data |
| `src/contexts/AuthContext.tsx` | Who is signed in and whether they are a member |
| `src/App.tsx` | All routes |
| `docs/BRAND_STYLE_GUIDE.md` | Colors, fonts, and voice for any new UI |

Stack: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site locally with live reload |
| `npm run build` | Rebuild the kit zip and build the site into `dist/` |
| `npm run preview` | Serve the built site |
| `npm run lint` | Check the code with ESLint |
| `npm run kit:zip` | Rebuild `public/case-kit.zip` from `case-kit/` |

## How to submit a pull request

1. In your fork, make a branch: `git checkout -b team-name-fix`.
2. Make your change and check it in the browser with `npm run dev`.
3. Run `npm run build` to make sure it builds.
4. Commit and push: `git add src`, `git commit -m "Short description of the fix"`, `git push origin team-name-fix`. Only commit your code changes, never `public/case-kit.zip`.
5. On GitHub, open your fork and click **Compare & pull request**. Make sure the base repository is `danielwait2/pma-case-competition` and the base branch is `main`.
6. Put your team name in the title. In the description, paste your spec: the problem, your evidence, what you built, what you did not build, and the metric you would watch.
7. Submit the pull request link at https://pma-website-bay.vercel.app/submit.

Small, focused pull requests are easier to review and merge into the live PMA site. A checks run builds every pull request automatically; a red check means the build broke.
