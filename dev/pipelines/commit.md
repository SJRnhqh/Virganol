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
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

Return the output from `dev/prompts/git-commit.md` as the final response.
