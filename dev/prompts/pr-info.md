# PR Info Prompt

AGENTS.md is my stable project-level development guide. First read AGENTS.md,
then read docs/TODO.md if it exists, and inspect the current git branch,
status, and diff.

Use this prompt when I ask for PR info, a PR title/body, a PR summary, or PR
text for the current branch.

Generate PR information directly:

- Use docs/TODO.md and the current diff to identify the completed branch scope.
- Generate one PR title using the Virganol commit convention from AGENTS.md.
- Generate one concise PR summary from docs/TODO.md and the current diff.
- Do not update TODO, generate a commit message, stage, commit, push, or open a
  PR unless I explicitly ask.
- Do not delete docs/TODO.md.

Output exactly these two sections:

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
