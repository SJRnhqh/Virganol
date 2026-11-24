# Branch TODO

- Branch: `feat/spirit-deps-major-updates`
- Parent: `feat/spirit`
- Goal: Evaluate and apply remaining major dependency upgrades in small,
  verified batches.

## Current

- [ ] Review major upgrade guides and choose the first low-risk batch.

## Planned

- [ ] Upgrade dependencies in focused commits; run `pnpm test` and
      `pnpm diff:budget` for each batch.

## Completed

- [x] Upgrade the commitlint family to 21.2.4. Cumulative diff budget: 30.9%;
      `pnpm test` passes.

- [x] Upgrade `eslint-plugin-react-refresh` to 0.5.8. Cumulative diff budget:
      11.6%; `pnpm test` passes.

- [x] Upgrade `@types/node` to 26.6.6. Cumulative diff budget: 10.4%; `pnpm test`
      passes.

- [x] Upgrade `globals` to 17.14.0. Diff budget: 1.5%; `pnpm test` passes.
