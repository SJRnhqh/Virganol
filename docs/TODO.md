# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Continue the frontend shell polish queued in `ROADMAP.md` 6.5, with
  the store layer as the branch's main focus after the boundaries gate.

## Current

- [ ] Wire the settings store into the disclosure slice: extend
  `SettingsState`, rename `openSettings`/`closeSettings` to `open`/`close`,
  and migrate the hotkeys, settings modal, and smart-settings consumers.

## Planned

- [ ] Extract a `createDisclosure` implementation factory once the second
  hand-written disclosure exists.
- [ ] Migrate navigation out of the sidebar: define the `NavId` union and
  `DEFAULT_NAV_ID` in the types layer as the source of truth, add a
  `NavigationState` interface with its own store, drop `activeId` and
  `setActiveId` from the sidebar, and rewire MainStage, Breadcrumb,
  useSmartSettings, and MainLayout.
- [ ] Move whole-store destructuring consumers to fine-grained selectors,
  including `useSidebarStyles`.
- [ ] Tighten `handleKeyDown` dependency injection with picked slice types.
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
- [x] Extract `DisclosureState` and compose it into `SidebarState`,
  mirror the interface order in the store with paired state/action members
  and bilingual member JSDoc, and drop the dead `setOpen`/`setSide` actions.
