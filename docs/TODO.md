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

- [x] Upgrade `globals` to 17.14.0. Diff budget: 1.5%; `pnpm test` passes.
