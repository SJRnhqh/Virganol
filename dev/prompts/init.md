# Session Initialization

## Mission

Initialize a Virganol working session. Use this prompt at the start of a
session or when the assistant needs to realign with the current project state.

For this stage, only familiarize yourself with the project and support
development discussion: clarify ideas, judge boundaries, analyze architecture,
and reason about development order.

## Procedure

- Read `AGENTS.md` for project-level development guidance.
- Inspect the current git branch, worktree status, latest commit, and diff
  summary.
- Read `docs/TODO.md` for branch-level execution state.
- Read other Markdown documents under `docs/` only when needed for the current
  request.
- Inspect relevant directories only when needed to understand project structure.
- Summarize the current project context and call out any documentation/code
  mismatch.

## Rules

- Use read-only inspection only.
- If documentation and code state disagree, point out the mismatch and discuss it with me before changing anything.

## Deliverable

Return a session context summary covering the current branch, development
focus, documentation state, and any mismatch or risk found during
initialization.
