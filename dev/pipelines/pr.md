# PR

## Scenario

Use this pipeline when the user explicitly asks to publish the current branch
and create a GitHub pull request using an available PR title and summary.

## Flow

1. `dev/prompts/git-push.md`
2. `dev/prompts/gh-pr.md`

## Rules

- Run this pipeline only for an explicit PR creation request with available PR
  title and summary; run `dev/pipelines/pr-prep.md` first if either is missing.
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

- Briefly summarize the push result.
- Return the output from `dev/prompts/gh-pr.md`.
