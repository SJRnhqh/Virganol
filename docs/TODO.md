# Branch TODO

- Branch: `feat/spirit-eslint-import`
- Goal: Simplify frontend import ordering by replacing `eslint-plugin-import` with the existing `eslint-plugin-simple-import-sort` dependency while preserving the intended grouping behavior.

## Current

- [ ] Restore the stashed ESLint import-ordering changes and verify that the simplified rule preserves the intended import groups and CSS side-effect placement.

## Planned

- [ ] Remove `eslint-plugin-import` from the UI development dependencies and refresh the lockfile without unrelated dependency changes.
- [ ] Run the frontend lint and repository validation suites, then review the final dependency and configuration diff.

## Completed

- [x] Isolate the ESLint import-ordering cleanup on `feat/spirit-eslint-import` and retain the implementation in `stash@{0}`.
