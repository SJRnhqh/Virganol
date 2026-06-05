# Session Initialization

## Mission

Initialize a Virganol working session. Use this prompt at the start of a
session or when the assistant needs to realign with the current project state.

For this stage, only familiarize yourself with the project and support
development discussion: clarify ideas, judge boundaries, analyze architecture,
and reason about development order.

## Procedure

- Read `AGENTS.md` for project-level development guidance.
- Read the Markdown documents under `docs/` to understand current development
  progress, branch tasks, and project structure.
- Inspect the current git branch and worktree status.
- Inspect relevant directories only when needed to understand project structure.
- Summarize the current project context and call out any documentation/code
  mismatch.

## Rules

- You may run read-only commands to inspect directories, documentation, git branch, and git status.
- Do not write code, modify files, commit changes, or do anything I have not explicitly requested before I ask for implementation.
- If documentation and code state disagree, point out the mismatch and discuss it with me before changing anything.
- Keep answers simple and concise unless I ask for deeper expansion.
- Communicate with me in Chinese.

## Output

Return a concise Chinese summary of the current branch, development focus,
relevant documentation state, and any mismatch or risk found during
initialization.
