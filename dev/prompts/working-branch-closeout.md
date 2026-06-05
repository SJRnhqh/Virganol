# Working Branch Closeout Prompt

AGENTS.md is my stable project-level development guide. First read AGENTS.md,
then read docs/TODO.md if it exists, and inspect the current git branch,
status, and diff.

Use this prompt when I ask to close out, finish, or end the current working
branch.

Perform the working branch closeout directly:

- Use docs/TODO.md and the current diff to confirm the working branch scope is
  complete.
- Delete docs/TODO.md after extracting the branch task context.
- Generate one closeout commit message using the Virganol commit convention
  from AGENTS.md.
- Do not generate PR info unless I explicitly ask.
- If PR info and working branch closeout are both requested, generate PR info
  before deleting docs/TODO.md.
- Do not stage, commit, push, or open a PR unless I explicitly ask.

Output exactly:

## Closeout

Briefly summarize whether docs/TODO.md was deleted and what branch scope it
closed out.

## Commit Message

Return one commit message in a fenced code block. Follow the Virganol commit
message convention from AGENTS.md exactly.

Default behavior:

- Communicate with me in Chinese.
- Keep the answer concise.
- Do not include raw git diffs.
