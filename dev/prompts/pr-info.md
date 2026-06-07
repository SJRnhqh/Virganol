# PR Information

## Mission

Generate PR title and summary for the current working branch. Use this prompt
when PR text needs to be prepared before the branch is pushed or a PR is
opened.

## Procedure

- Read `AGENTS.md` for project-level development guidance and title
  conventions.
- Inspect the current git branch and worktree status.
- Identify the target branch from explicit user context or the current branch
  relationship.
- Inspect the current branch commits and diff against the target branch.
- Read `docs/TODO.md` if it exists; if it was already removed during closeout,
  recover the latest branch TODO context from git history or branch diff when
  available.
- Generate one PR title and one concise PR summary from the completed branch
  scope.

## Rules

- Do not modify files.
- Summarize branch changes at PR level, not as file-by-file patches.
- Use the Virganol title convention for the PR title.

## Deliverable

Return one PR title in a fenced code block and one PR summary in a fenced
markdown code block using this format:

```markdown
## Summary
- ...
```
