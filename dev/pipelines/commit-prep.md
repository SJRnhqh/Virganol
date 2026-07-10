# Commit Preparation

## Scenario

Use this pipeline when the current coherent change set should be prepared for a
commit by updating branch TODO state and generating a commit message, without
creating the commit.

## Flow

1. `dev/prompts/todo-update.md`
2. `dev/prompts/commit-message.md`

## Rules

- Treat this as preparation only: do not stage, commit, push, or open a PR.
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

- Briefly summarize what changed in docs/TODO.md.
- Return one commit message in a fenced code block.
