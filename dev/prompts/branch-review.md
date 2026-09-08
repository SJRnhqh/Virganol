# Branch Review

## Mission

Review the working branch against its intended merge target before closeout.

## Procedure

- Reuse valid context; consult AGENTS, branch TODO, relevant rules and decisions.
- Resolve the intended merge target: use the user's explicit instruction when
  available; otherwise consult an existing PR's base branch or branch documents.
  Reuse a target already confirmed in the session unless new evidence conflicts.
  If evidence is missing or conflicting, ask the user before reviewing the diff.
  Do not infer the target solely from branch names, upstream tracking, or commit
  ancestry; the target is where this branch should merge, not necessarily where
  it was created.
- Once the target is confirmed, compute the merge base; inspect commits and
  `git diff <target>...HEAD`.
- Apply `differential-review` and `ponytail-review` with shared evidence and
  manual fallbacks for absent agents; check applicable style rules.
- Apply `spartan` to the Chinese report.

## Rules

- Read-only: no edits, report files, or git/PR mutations.
- Review committed changes; inspect dependencies only as needed for impact.
- Clarify ambiguous scope; revisit accepted decisions only with new evidence.
- These rules and deliverables override skill defaults.

## Deliverable

- `ship` or `fix first`, reason, merge target with confirmation evidence, merge
  base, and reviewed range.
- Findings by severity: class, changed `file:line`, trigger/impact, and fix;
  distinguish confirmed issues from suspicions.
- Checks performed, clean areas, and test/coverage limits; `ship` applies only
  to reviewed coverage, not release readiness.
