# Branch TODO

- Branch: `feat/spirit-deps-runtime-majors`
- Parent: `feat/spirit`
- Goal: Evaluate the remaining runtime and tooling major upgrades in small,
  verified batches.

## Current

- [ ] Review the remaining major upgrades and choose the first batch.

## Planned

- [ ] Verify each batch with `pnpm test` and `pnpm diff:budget`.

## Completed

- [x] Upgrade Stylelint and its standard config to v18/v41. Diff budget: 75.7%;
      `pnpm test` passes.
