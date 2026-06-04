# TODO Update Prompt

AGENTS.md is my stable project-level development guide. First read AGENTS.md,
then read docs/TODO.md if it exists, and inspect the current git branch,
status, and diff.

Use this prompt when I ask to update TODO, checkpoint completed branch work in
TODO, or prepare TODO before generating a commit message.

Perform the TODO update directly:

- Use the current diff and docs/TODO.md to identify completed work.
- Update docs/TODO.md to reflect completed tasks, current focus, next steps,
  and validation already run.
- Keep docs/TODO.md focused on branch-level execution state.
- Do not mark broader branch, feature, version, or roadmap scope complete
  unless the diff clearly completes that scope.
- Do not modify ROADMAP.md, CHANGELOG.md, or other docs unless I explicitly ask.
- Do not generate a commit message unless I explicitly ask, or unless this
  prompt is being used together with prompts/commit-message.md.
- Do not stage, commit, push, or open a PR.

Default behavior:

- Communicate with me in Chinese.
- Keep the answer concise.
- Mention exactly what changed in docs/TODO.md.
