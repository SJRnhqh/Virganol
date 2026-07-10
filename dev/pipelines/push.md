# Push

## Scenario

Use this pipeline when the user explicitly asks to push existing local commits
from the current branch.

## Flow

1. `dev/prompts/git-push.md`

## Rules

- Run this pipeline only for an explicit push request.
- Do not open a PR.
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

Return the output from `dev/prompts/git-push.md` as the final response.
