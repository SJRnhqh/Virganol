# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Land the deferred shell dependency-direction gate (the stashed
  boundaries wiring) and continue the frontend shell polish queued in
  `ROADMAP.md` 6.5.

## Current

- [ ] Restore the stashed boundaries wiring (eslint-plugin-boundaries config,
  deps, and the `types/state` relative import) onto the post-#42 base and
  adapt it to the merged shell layout.

## Planned

- [ ] Wire the shell dependency-direction gate: an element matrix enforcing
  one-way shell ↔ feature dependencies, plus the reverse-waterfall strategy
  for absorbing `features/` and a verdict on codifying `../` vs `@/` range
  layering.
- [ ] Resolve the `types/state/settings.ts` barrel self-import cycle from #42
  (same-package `../` exemption or a deep `@/types/settings` link).
- [ ] Fix the inherited `osType` Promise bug in `WindowHeader`
  (`useState(() => type())` never resolves; Mac spacer and Windows controls
  never render).
- [ ] Delete the dead `ModuleMenu` component and the commented scaffolding in
  `Breadcrumb`.

## Completed

- [x] Seed the branch from `feat/spirit` at `ce368be9` (post #42 squash
  merge).
