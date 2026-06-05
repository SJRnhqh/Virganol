# Working Branch Closeout Pipeline

Use this pipeline when the user asks to prepare PR info and close out the
current working branch.

Run these prompts in order:

1. Read `dev/prompts/pr-info.md` and follow it.
2. Read `dev/prompts/working-branch-closeout.md` and follow it.

Rules:

- Generate PR info before deleting docs/TODO.md.
- Do not stage, commit, push, or open a PR.
- Keep the response concise and in Chinese.

Output:

- Return PR title and PR summary.
- Briefly summarize whether docs/TODO.md was deleted and what branch scope it
  closed out.
- Return one closeout commit message in a fenced code block.
