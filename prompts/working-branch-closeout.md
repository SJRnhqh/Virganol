# Working Branch Closeout Prompt

AGENTS.md is my stable project-level development guide. First read AGENTS.md,
then read docs/TODO.md if it exists, and inspect the current git branch,
status, and diff.

This prompt is only for closing out a working branch.

Perform the closeout steps directly:

- Use docs/TODO.md and the current diff to identify the completed branch scope.
- Delete docs/TODO.md after extracting the branch task context.
- Generate one commit message for the closeout changes using the Virganol
  commit convention from AGENTS.md.
- Generate one PR title using the same convention as a commit message header.
- Generate one concise PR summary from docs/TODO.md and the current diff.
- Do not create commits, push, or open a PR unless I explicitly ask.

Output exactly these three sections:

## Commit Message

Return one commit message in a fenced code block. Follow the Virganol commit
message convention from AGENTS.md exactly.

## PR Title

Return one PR title in a fenced code block. Use the same title convention as a
commit message header for the current working branch type.

## PR Summary

Return one PR body in a fenced markdown code block using this format:

```markdown
## Summary
- ...
```

Default behavior:

- Communicate with me in Chinese.
- Keep the answer concise.
- Do not include raw git diffs.
