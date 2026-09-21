# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Land the deferred shell dependency-direction gate (the stashed
  boundaries wiring) and continue the frontend shell polish queued in
  `ROADMAP.md` 6.5.

## Current

- [ ] Polish the stores: remove the dead `setOpen`/`setSide` actions, govern
  the `toggleSide` UI choreography timing, narrow `activeId` to the navigation
  id union, extract a shared open/close slice composed into both store shapes
  (composition over one-to-one component mapping), and then tighten the
  `handleKeyDown` dependency injection through picked slice types.

## Planned

- [ ] Clear the inherited review findings: fix the `osType` Promise bug in
  `WindowHeader` and delete the dead `ModuleMenu` component plus the commented
  scaffolding in `Breadcrumb`.

- [ ] Decide the reverse-waterfall strategy for absorbing `features/` into the
  boundaries gate and codify the `../` vs `@/` range-layering verdict once a
  rule shape is found (currently manual: cross-directory shell imports use
  `@/`, same-package relatives are tolerated).

## Completed

- [x] Seed the branch from `feat/spirit` at `ce368be9` (post #42 squash
  merge).
- [x] Land the shell dependency-direction gate: restored the stashed
  boundaries wiring, tightened the policy matrix to actual per-layer usage in
  canonical layer order, generated policies from an explicit allows table, and
  approved the `unrs-resolver` build script in `pnpm-workspace.yaml`.
- [x] Resolve the `types/state/settings.ts` barrel self-import cycle by
  switching to a same-package relative import.
