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
- Keep the response concise and in Chinese.

## Deliverable

- Briefly summarize the push result.
- Return the output from `dev/prompts/gh-pr.md`.
