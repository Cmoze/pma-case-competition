# PMA Case Interview site

A practice copy of the BYU Product Management Association website, used for a one hour PM case interview event (Case Interview: Build the Fix with AI). The user is a student acting as PM. Read `case-kit/brief.md` for the case. All names, accounts and data are fictional.

## Stack

React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui (`src/components/ui`), React Router (routes in `src/App.tsx`). npm, not bun or yarn.

## Data

There is no backend and no environment variables. `src/lib/localDb/index.ts` exports `db`, an in browser stand in that supports `db.from(table).select/insert/update/delete/upsert` with `.eq/.order/.single` and `db.auth.*`. It persists to localStorage; starting data lives in `src/lib/localDb/seed.ts`. Do not add a hosted backend, external APIs, or secrets. Demo member login: `member@byu.edu` / `demo1234`.

## Where things live

* Pages: `src/pages/` (one file per route)
* Resource library content: `src/lib/resources.ts`
* Practice interview videos: `src/lib/videoLibrary.ts`
* APM playbook: `src/lib/apmPlaybook.ts`
* Sign in state and membership: `src/contexts/AuthContext.tsx`
* Case kit (brief, CSVs, interviews): `case-kit/`

## Skills

`.claude/skills/` has `case-coach` (coach the student with questions, never give the cause), `write-spec` (write SPEC.md), and `ship-pr` (build check and PR against danielwait2/pma-case-competition).

## Style

Follow `docs/BRAND_STYLE_GUIDE.md` for any new UI. Reuse the Tailwind theme tokens (`primary`, `muted`, `border`, `card`) and existing shadcn components instead of new colors or libraries. TypeScript only, minimal comments.

## Commands

* `npm install`
* `npm run dev` (http://localhost:8080)
* `npm run build` (must pass before opening a PR; also rebuilds `public/case-kit.zip`)
* `npm run lint`

## Pull requests

Keep PRs small and focused on one fix. Do not reformat unrelated files. Put the team's spec (problem, evidence, what changed, metric to watch) in the PR description.

## Gotchas

* The `/resources` lock screen is `src/components/LockedResourcesView.tsx`. `MemberLockout.tsx` and `RoadmapPage.tsx` are legacy and not on the main path.
* `npm run lint` has 13 existing warnings. Ignore them; only errors fail CI.
* Do not commit `public/case-kit.zip`.
