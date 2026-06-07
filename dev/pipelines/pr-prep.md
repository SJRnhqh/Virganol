# PR Preparation

## Scenario

Use this pipeline when the current working branch should be prepared for PR
review by generating PR title and summary.

## Flow

1. `dev/prompts/pr-info.md`

## Rules

- Treat this as preparation only: do not stage, commit, push, or open a PR.
- Keep the response concise and in Chinese.

## Deliverable

Return the output from `dev/prompts/pr-info.md` as the final response.
