# Branch Review

## Scenario

Use this pipeline when the current working branch should be systematically
reviewed against its parent branch before branch verification and closeout.

## Flow

1. `dev/prompts/branch-review.md`

## Rules

- Read-only: do not modify files, write report files into the repository,
  stage, commit, push, or open a PR.
- Scope the review to the working branch diff against its parent branch, not
  the whole repository.
- Route the review skills explicitly: `differential-review` for defect,
  security, and test-coverage findings; `ponytail-review` for
  over-engineering findings. Do not use `ponytail-audit`; it audits whole
  repositories instead of branch diffs.
- Do not let `differential-review` write its report file into the repository;
  findings are returned in the response only.
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

Return the output from `dev/prompts/branch-review.md` as the final response.
