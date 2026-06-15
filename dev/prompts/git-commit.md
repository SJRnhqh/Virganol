# Git Commit

## Mission

Create one git commit using an already prepared commit message.

## Procedure

- Confirm the commit message from the user or prior `dev/prompts/commit-message.md`
  output.
- Inspect the current git status and diff.
- Stage the files that belong to the prepared change set.
- Inspect the staged diff before committing.
- Commit using the confirmed commit message.
- Confirm the commit result and read the final git status.

## Rules

- Use only the confirmed commit message.
- Do not push, open a PR, amend, rebase, reset, or rewrite history.
- Do not stage unrelated files. If the intended commit scope is ambiguous, stop
  and ask before committing.
- If the commit fails, report the failure and leave the worktree state clear.

## Deliverable

Return the commit hash, commit message, hook or validation result, and final
git status.
