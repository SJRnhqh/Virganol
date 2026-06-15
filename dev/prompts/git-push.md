# Git Push

## Mission

Push the current branch to its remote. Use this prompt when local commits are
ready to be published.

## Procedure

- Inspect the current git branch and worktree status.
- Inspect the upstream tracking branch and unpushed commits.
- If the branch is already up to date with its upstream, report that no push is
  needed.
- If the branch has an upstream, push the current branch to that upstream.
- If the branch has no upstream, push the current branch to `origin` and set
  the upstream tracking branch.
- Confirm the push result and read the final git status.

## Rules

- Push only the current branch.
- Do not stage, commit, force-push, push tags, amend, rebase, reset, or rewrite
  history.
- If the worktree has uncommitted changes, report them before pushing and stop
  if they make the push scope ambiguous.
- If the remote or upstream target is ambiguous, stop and ask before pushing.

## Deliverable

Return the pushed branch, upstream target, pushed commit range or up-to-date
state, and final git status.
