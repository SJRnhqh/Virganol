# Commit

## Scenario

Use this pipeline when the user explicitly asks to create a git commit and a
commit message has already been prepared or provided.

## Flow

1. `dev/prompts/git-commit.md`

## Rules

- Run this pipeline only for an explicit commit request with an available commit
  message.
- Do not run commit preparation steps.
- Keep the response concise and in Chinese.

## Deliverable

Return the output from `dev/prompts/git-commit.md` as the final response.
