# TODO Closeout

## Mission

Close the current working branch TODO. Use this prompt when the branch task is
ready to be finalized and `docs/TODO.md` should be removed.

## Procedure

- Read `AGENTS.md` for project-level development guidance.
- Read `docs/TODO.md` and extract the branch, goal, completed work, and any
  remaining task state.
- Inspect the current git branch, worktree status, and relevant diff.
- Confirm that the branch-level TODO can be closed out from the available
  context.
- Delete `docs/TODO.md` directly.

## Rules

- Only modify `docs/TODO.md`.
- Do not generate a commit message.
- Do not delete `docs/TODO.md` if the branch closeout state is ambiguous; stop
  and explain what must be clarified first.

## Deliverable

Report whether `docs/TODO.md` was deleted and summarize the branch scope that
was closed out.
