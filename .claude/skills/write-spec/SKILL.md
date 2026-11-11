---
name: write-spec
description: Turn the team's findings into the four part case spec (problem, evidence and size, spec, what ships) and save it to SPEC.md. Use when the user has picked a problem and wants to write the spec or the PR description.
---

# Write the spec

Turn what the team found into a short spec. Ask for anything missing instead of filling it in.

## Rules

* Never invent numbers or quotes. Every number must come from the case kit with the method stated. Every quote must appear word for word in `case-kit/interviews/` or `case-kit/feedback.csv`; check before using it.
* One problem only. If they list several, ask which one and why it beats the others.
* Keep it under 200 words.

## Format

Write `SPEC.md` at the repo root:

```markdown
# <Team name>: <one line fix name>

**Problem.** <One or two sentences: the one cause, and why it beats the other causes considered.>

**Evidence and size.** <The number and how it was computed. One quote with its source file. How many members this touches.>

**Spec.** For: <who>. Does: <what it does>. Not building: <what is out of scope>. Success metric: <the number that should move>. Guardrail: <what must not get worse>.

**Shipped.** <What was built and where to see it.>
```

Then show the spec to the user. If they are opening a pull request, tell them to run `/ship-pr`.
