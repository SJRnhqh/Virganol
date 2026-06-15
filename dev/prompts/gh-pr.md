# GitHub PR

## Mission

Create one GitHub pull request for the current branch using an existing PR
title and summary.

## Procedure

- Confirm the PR title and summary from the user or prior
  `dev/prompts/pr-info.md` output.
- Inspect the current git branch, worktree status, upstream branch, and remote
  branch state.
- Determine the PR base branch from explicit user context or the project branch
  workflow.
- Check whether an open PR already exists for the current branch.
- Create one PR from the current branch to the confirmed base branch.
- Confirm the PR result and read the final git status.

## Rules

- Use only the confirmed PR title and summary.
- Do not modify files, local git state, or existing PR state except creating
  one PR.
- Do not create a duplicate PR if one already exists; report the existing PR
  instead.
- If the base branch, PR title, PR summary, or remote branch state is
  ambiguous, stop and ask before creating the PR.

## Deliverable

Return the PR URL, base branch, head branch, PR title, whether a new or
existing PR was used, and final git status.
