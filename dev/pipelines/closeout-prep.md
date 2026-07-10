# Closeout Preparation

## Scenario

Use this pipeline when the current working branch should be prepared for final
closeout by removing the branch TODO and generating a commit message.

## Flow

1. `dev/prompts/todo-closeout.md`
2. `dev/prompts/commit-message.md`

## Rules

- Treat this as preparation only: do not stage, commit, push, or open a PR.
- Do not generate PR information.
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

- Briefly summarize the TODO closeout.
- Return one commit message in a fenced code block.
