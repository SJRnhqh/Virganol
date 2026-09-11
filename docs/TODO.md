# Branch TODO

- Branch: `feat/spirit-eslint-import`
- Goal: Simplify frontend import ordering by replacing `eslint-plugin-import` with the existing `eslint-plugin-simple-import-sort` dependency while preserving the intended grouping behavior.

## Current

- [x] Replace `eslint-plugin-import` with the existing `eslint-plugin-simple-import-sort` dependency while preserving the intended import groups and CSS side-effect placement.

## Completed

- [x] Isolate the ESLint import-ordering cleanup on `feat/spirit-eslint-import` and retain the implementation in `stash@{0}`.
- [x] Remove `eslint-plugin-import` from the UI development dependencies and refresh the lockfile, eliminating its unused transitive dependency tree.
- [x] Run the frontend lint successfully and review the final dependency and configuration diff.
