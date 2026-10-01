# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Polish the frontend shell under `ROADMAP.md` 6.5. MainLayout-facing
  store and hotkeys reviews are complete; evaluate CSS next.

## Current

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
  review; decide enforceable `../` vs `@/` rules (currently cross-directory
  shell imports use `@/`, same-package relatives are tolerated).

## Completed

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
