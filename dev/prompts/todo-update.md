# TODO Update

## Mission

Update `docs/TODO.md` to reflect the current branch execution state. Use this
prompt when branch progress needs to be recorded or prepared before a commit
message is generated.

## Procedure

- Read `AGENTS.md` for project-level development guidance.
- Read `docs/TODO.md` if it exists.
- Inspect the current git branch, worktree status, and diff.
- Use the current diff and `docs/TODO.md` to identify completed work, current
  focus, and next steps.
- Update `docs/TODO.md` directly.

## Rules

- Keep `docs/TODO.md` focused on branch-level execution state.
- Do not mark broader branch, feature, version, or roadmap scope complete
  unless the diff clearly completes that scope.
- Do not modify `ROADMAP.md`, `CHANGELOG.md`, or other docs unless explicitly
  asked.
- Do not generate a commit message unless explicitly asked or used together
  with `dev/prompts/commit-message.md`.

## Deliverable

Update `docs/TODO.md` and report exactly what changed there.
