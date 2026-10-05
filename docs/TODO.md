# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Polish the frontend shell under `ROADMAP.md` 6.5. MainLayout-facing
  store and hotkeys reviews are complete; review remaining ESLint conventions
  and evaluate CSS next.

## Current

- [ ] Review worthwhile additional ESLint constraints, starting with omitted
  script extensions; assess redundant relative paths and import formatting.
  Prefer existing rules/plugins and mature solutions where justified; retain
  useful import aliases and defer feature/stylesheet path gates.
- [ ] Evaluate PandaCSS, vanilla-extract, and StyleX against the current
  lint-disciplined CSS. Prototype typed `layouts.css` recipes/patterns,
  retain plain-CSS tokens/base during transition, and assess authoring DX,
  theme contracts, and static output before adopting another pipeline.

## Planned

- [ ] Use fine-grained selectors / `useShallow` picks in `useSidebarStyles`,
  `SidebarToggle`, and `SideSwitch`.
- [ ] Evaluate native `@scope (...) to (...)` for sidebar/module internals
  when component structure emerges; retain global `@layer` shell styles
  and decide the scope/BEM split.
- [ ] Align `MainStage` with `NavId` and derived props under `types/props/`.
- [ ] Consider deriving `NavId` from `NAV_IDS as const` to unify navigation
  vocabulary and constants.
- [ ] After the sidebar slice, decide whether settings needs `toggle` instead
  of the current open/close composition; confirm bare open keeps the last tab.
- [ ] Fix the inherited `WindowHeader` `osType` Promise bug. Keep parked
  `ModuleMenu` and commented `Breadcrumb` scaffolding pending a decision.
- [ ] Extend the boundaries gate into `features/` via reverse-waterfall
  review.
- [ ] Align TypeScript style documentation with the enforced ESLint policies
  after rule coverage reaches the full frontend; defer `docs/rules/` edits
  meanwhile and document the finalized project conventions together.

## Completed

- [x] Require double quotes only in static import sources within the current
  shell/root lint scope using `no-restricted-syntax`; leave other strings
  unchanged. Full UI ESLint, import/body scope checks, and repository
  `pnpm test` passed.
- [x] Reject explicit `/index` and `/index.*` in cross-shell alias imports,
  preserving stylesheet resource entries and the deferred feature scope.
  Full UI ESLint and in-memory entry spelling checks passed.
- [x] Require relative paths within the root app element using the existing
  boundaries policy: main's `./App` passes and `@/App` is rejected. Full UI
  ESLint and in-memory root import checks passed.
- [x] Verify remaining root import alternatives with eight in-memory ESLint
  checks: script extensions/redundant relatives, stylesheet paths, namespace
  and aliased imports, and import formatting still pass. Track these for
  subsequent policy review; current gates do not imply unique import text.
- [x] Enforce shell import paths through existing boundaries policies, deriving
  module types from the direction matrix: cross-module aliases resolve to
  root `index.ts`; internal imports and
  re-exports use relative paths. Normalize App's layouts import; full UI
  ESLint, TypeScript, and boundary behavior checks passed.
- [x] Enforce shell module public entries through `boundaries/dependencies`:
  cross-module imports/re-exports resolve to root `index.ts`, while internal
  dependencies remain direct. Full UI ESLint and 22 boundary behavior checks
  passed.
- [x] Enforce shell type imports with `consistent-type-imports` and
  `no-import-type-side-effects`: use top-level `import type` for type-only
  declarations and keep mixed declarations inline, reusing existing plugins.
  Full UI source ESLint and in-memory autofix/sort checks passed.
- [x] Complete the `useKeyboardShortcuts` review: select only required
  settings/sidebar members with `useShallow`, pair listener registration
  with cleanup, and delegate shortcut logic to the dispatcher and handlers.
  TypeScript and repository `pnpm test` checks passed.
- [x] Polish hotkeys: listener hook → dispatcher → settings/sidebar handlers;
  guard editable targets with `instanceof`, normalize input privately, use
  `isMod` and `event, isMod, key, deps` argument order. Keep settings-first
  dispatch, key-based switches, toggle-before-Escape order, and the sidebar
  modifier guard. Align bilingual comments.
- [x] Centralize `ShortcutDeps`, `SettingsShortcutDeps`, `SidebarShortcutDeps`
  in that order under `types/logic/hotkeys.ts`, with type-only barrel exports.
  Keep the grouped contract as an interface and derive child dependencies
  from state via `Pick`. TypeScript and targeted ESLint checks passed.
- [x] Separate navigation from sidebar state: NavigationStore owns `NavId`;
  SidebarStore owns disclosure/docking. Rewire consumers and derive Sidebar
  props; default navigation reads `NAV_ITEMS[0].id`.
- [x] Narrow MainLayout subscriptions to sidebar `side` and a `useShallow`
  navigation pick. TypeScript and targeted ESLint checks passed.
- [x] Simplify sidebar docking to synchronous `toggleSide(): void`; remove
  switching state, delay/guard, and switch-only fading; retain open/close motion.
- [x] Share disclosure through `DisclosureState` and `createDisclosure`;
  narrow `DisclosureUpdater` to private value-only `isOpen` reads/updates,
  retain store-owned defaults, and remove dead `setOpen` / `setSide` actions.
  Align member order and bilingual JSDoc; TypeScript/targeted ESLint passed.
- [x] Compose SettingsState with disclosure, migrate consumers to `open`/`close`,
  and retain the last settings tab on bare open.
- [x] Establish type style: hand-written object contracts use interfaces;
  derived component props use `Pick` aliases under `types/props/`.
- [x] Extract MainLayout CSS into `styles/layouts.css`, loaded via `index.css`;
  use `data-side` and `main-layout__workspace`, removing redundant declarations.
- [x] Add recess-order/stylelint-order for `base.css` and `layouts.css`;
  put `@apply` after declarations and add per-field bilingual intent comments.
- [x] Refine main/App/MainLayout comments: mount causality at entry,
  identity at component/layout, and no child-responsibility leakage.
- [x] Activate Mead, Apiary, and Bar navigation entries for all NavId members.
- [x] Gate shell dependency direction with an explicit allows matrix,
  including justified `store → constants` and `components → types` edges;
  approve the `unrs-resolver` build script.
- [x] Enforce semantic alias ordering:
  `types → constants → lib → store → hooks → features → components → layouts`;
  preserve external/side-effect grouping and relative-import policy.
- [x] Seed from `feat/spirit` at `ce368be9` after PR #42 squash merge.
