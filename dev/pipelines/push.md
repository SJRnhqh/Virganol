# Push

## Scenario

Use this pipeline when the user explicitly asks to push existing local commits
from the current branch.

## Flow

1. `dev/prompts/git-push.md`

## Rules

- Run this pipeline only for an explicit push request.
- Do not open a PR.
- Keep the response concise and in Chinese.

## Deliverable

Return the output from `dev/prompts/git-push.md` as the final response.
