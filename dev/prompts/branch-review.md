# Branch Review

## Mission

Review the working branch against its parent before closeout.

## Procedure

- Reuse valid context; consult AGENTS, branch TODO, relevant rules and decisions.
- Resolve the parent and merge base; inspect commits and `git diff <parent>...HEAD`.
- Apply `differential-review` and `ponytail-review` with shared evidence and
  manual fallbacks for absent agents; check applicable style rules.
- Apply `spartan` to the Chinese report.

## Rules

- Read-only: no edits, report files, or git/PR mutations.
- Review committed changes; inspect dependencies only as needed for impact.
- Clarify ambiguous scope; revisit accepted decisions only with new evidence.
- These rules and deliverables override skill defaults.

## Deliverable

- `ship` or `fix first`, reason, parent, and reviewed range.
- Findings by severity: class, changed `file:line`, trigger/impact, and fix;
  distinguish confirmed issues from suspicions.
- Checks performed, clean areas, and test/coverage limits; `ship` applies only
  to reviewed coverage, not release readiness.
