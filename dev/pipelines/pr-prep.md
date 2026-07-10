# PR Preparation

## Scenario

Use this pipeline when the current working branch should be prepared for PR
review by generating PR title and summary.

## Flow

1. `dev/prompts/pr-info.md`

## Rules

- Treat this as preparation only: do not stage, commit, push, or open a PR.
- Write in terse Chinese fragments, not explanatory paragraphs.
- Lead with the result; use one short line per required fact; omit greetings,
  transitions, process narration, and repeated context.

## Deliverable

Return the output from `dev/prompts/pr-info.md` as the final response.
