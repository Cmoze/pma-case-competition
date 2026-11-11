---
name: ship-pr
description: Check the build and open a small pull request from the team's fork against danielwait2/pma-case-competition with SPEC.md as the description. Use when the fix is built and the user wants to submit it.
---

# Ship the pull request

## Steps

1. Run `npm run build`. If it fails, fix the error before going on. Run `npm run lint`; only errors matter, the existing warnings are fine.
2. Run `git status` and `git diff --stat`. Only the team's code changes and `SPEC.md` belong in the PR. Never stage `public/case-kit.zip`, `case-kit/`, lockfile churn, or unrelated formatting. Ask before including anything unexpected.
3. If `SPEC.md` does not exist, run `/write-spec` first.
4. Create a branch named after the team, for example `git checkout -b team-name-fix`, commit with a short message, and push to the fork (`origin`).
5. Open the PR against the original repo:
   `gh pr create --repo danielwait2/pma-case-competition --base main --title "<Team name>: <fix>" --body-file SPEC.md`
   If `gh` is not installed or not signed in, give the user the link to their fork on GitHub and tell them to click **Compare & pull request**, set the base repository to `danielwait2/pma-case-competition`, and paste `SPEC.md` into the description.
6. Remind them to add a screenshot of the change to the PR, and to submit the PR link at https://pma-website-bay.vercel.app/submit.
