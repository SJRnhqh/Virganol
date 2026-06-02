# Commit Checkpoint Pipeline

Use this pipeline when the user asks to checkpoint a completed change, update
TODO before a commit, or update TODO and provide a commit message.

Run these prompts in order:

1. Read `prompts/todo-update.md` and follow it.
2. Read `prompts/commit-message.md` and follow it.

Rules:

- Do not stage, commit, push, or open a PR.
- Do not modify ROADMAP.md, CHANGELOG.md, or other docs unless the user
  explicitly asks.
- Keep the response concise and in Chinese.

Output:

- Briefly summarize what changed in docs/TODO.md.
- Return one commit message in a fenced code block.
