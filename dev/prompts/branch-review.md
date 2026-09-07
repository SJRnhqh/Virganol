# Branch Review

## Mission

Review the current working branch against its parent branch. Use this prompt
when the branch implementation has settled and the full branch diff needs a
systematic review before branch verification and closeout.

## Procedure

- Read `AGENTS.md` for project-level development guidance.
- Determine the current branch and its parent branch: use explicit context,
  the working-branch convention (working branches start from their `feat/*`
  parent), or `git merge-base`. Record the chosen parent branch.
- Inspect the branch commit list and the full branch diff against the parent
  branch (`git diff <parent>...HEAD`). Uncommitted changes are out of scope.
- Read `docs/TODO.md` for the intended branch scope.
- Read the `docs/rules/` files matching the file types present in the diff.
- Run the `differential-review` skill on the branch diff for defect, security,
  and test-coverage findings; take its manual fallback paths where the
  workspace lacks upstream plugin agents.
- Run the `ponytail-review` skill on the same diff for over-engineering
  findings.
- Cross-check the diff against the applicable `docs/rules/` style rules.

## Rules

- Do not modify files, stage, commit, push, or open a PR.
- Do not write report files into the repository; return all findings in the
  response.
- Every finding cites `file:line` evidence from the branch diff.
- Classify findings as defect, security, over-engineering, style-rule
  violation, or test gap.
- Report what was reviewed and found clean; state coverage limits honestly.
- Do not restate branch context or repeat a finding across sections.

## Deliverable

Return, leading with the verdict:

- One-line verdict: `ship` or `fix first`, with one line of justification.
- Findings grouped by class, each as one line with `file:line` and a one-line
  fix direction.
- Over-engineering summary ending with `net: -<N> lines possible.`.
- Test gap and clean-coverage notes, one line each.
