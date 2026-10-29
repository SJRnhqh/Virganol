# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Polish the frontend shell under `ROADMAP.md` 6.5; current focus is
  layouts and the incremental StyleX migration.

## Current

- [ ] Verify the migrated MainLayout in Tauri with real child components;
  ordinary browser startup currently fails on the existing native bridge
  dependency. Include native hot-update verification.
- [ ] Continue MainLayout's JSX/style review before choosing the next CSS
  migration slice; child-component styles remain outside the current scope.

## Planned

- [ ] Follow [StyleX #1745](https://github.com/facebook/stylex/pull/1745):
  the Rspack CSS-output fix merged on 2026-09-24, after the installed 0.19.1
  release. Upgrade to a release containing it, verify CSS output/HMR, and
  replace the temporary `.webpack()` adapter with `.rspack()`. The fix covers
  initial CSS output; it does not establish that hot updates work.
- [ ] After migration, reconcile the styles-only ESLint block with `srcFiles`;
  consider mature rules for consistent style authoring where useful.
- [ ] Verify Zed format-on-save; optionally improve duplicate-import autofix
  around file-header comments. Neither blocks the StyleX pilot.
- [ ] Narrow subscriptions in `useSidebarStyles`, `SidebarToggle`, and
  `SideSwitch` with selectors / `useShallow`.
- [ ] Revisit sidebar/module CSS scoping (`@scope`, `@layer`, BEM) after
  component boundaries emerge and the StyleX pilot is evaluated.
- [ ] Align `MainStage` with `NavId` and derived props under `types/props/`;
  consider deriving `NavId` from `NAV_IDS as const`.
- [ ] After the sidebar slice, decide whether settings needs `toggle`;
  recheck that bare `open` retains the last tab.
- [ ] Fix the inherited `WindowHeader` `osType` Promise bug; keep
  `ModuleMenu` and `Breadcrumb` scaffolding parked pending a decision.
- [ ] Extend boundary/import policies into `features/` through the
  reverse-waterfall review; stylesheet import policy remains deferred.
- [ ] Update `docs/rules/` once ESLint coverage and conventions settle
  across the frontend. Persistent import-rule regression scripts remain
  deferred at the user's request.

## Completed

- [x] Restore StyleX hot updates with official development-only
  `runtimeInjection`; retain Rsbuild/Rspack and production static CSS extraction.
  Repeated edits to real layout styles update immediately in the isolated
  browser fixture while preserving React state, input text, and sidebar side.
  Do not retain a dedicated regression script or test gate, per user preference.
  Repository checks and the UI production build pass.
- [x] Migrate only MainLayout's shell/workspace containers to StyleX through
  `@/styles` and conditional `props()` composition; allow layouts to consume
  styles without extending that permission to other shell layers. Remove
  `layouts.css`, its CSS import, obsolete Stylelint target, and `data-side`.
  Keep child-component styles unchanged.
- [x] Verify migrated container geometry against the old CSS in an isolated
  browser fixture with native-dependent children/hooks replaced: left/right
  metrics match at 1280×720; 640×480 sizing/overflow and theme-variable
  inheritance pass. Type checking, ESLint, Stylelint, production build, and
  emitted StyleX CSS checks pass; the initial hot-update limitation is fixed above.
- [x] Prepare the additive StyleX 0.19.1 pilot: `mainLayoutStyles` plus barrel
  export, Rsbuild compilation through the temporary Webpack-compatible
  adapter, standard `props()` usage (`sx` shorthand disabled), and internal
  CSS layers without custom Tailwind precedence. StyleX is the pilot choice;
  reconsider Panda only if concrete design-system needs justify it.
- [x] Enable five official StyleX ESLint rules for `src/styles/**/*.ts`:
  `valid-styles`, `valid-shorthands`, `sort-keys`, `no-nonstandard-styles`,
  and `no-legacy-contextual-styles`. Remove custom pixel normalization;
  retain TBDs for rule ownership and authoring consistency.
- [x] Validate StyleX CSS extraction with a temporary public-entry probe;
  UI type checking, ESLint, Stylelint, format checks, and production build
  passed. Latest integration simplification passed type checking, ESLint,
  Stylelint, and production build.
- [x] Review MainLayout-facing state: separate navigation from sidebar
  disclosure/docking, narrow subscriptions, make `toggleSide` synchronous,
  share disclosure helpers, remove dead actions, and retain the settings tab
  on bare `open`. Activate all navigation entries.
- [x] Review hotkeys: listener hook with cleanup → dispatcher → handlers;
  use narrow subscriptions, editable-target guards, normalized input, and
  centralized dependency types. Preserve settings-first dispatch and guards.
- [x] Extract MainLayout CSS into `styles/layouts.css` with semantic classes
  and `data-side`; apply Stylelint ordering to it and `base.css`. Align
  shell comments and interface / derived-prop conventions.
- [x] Enforce shell dependency direction and public entries: cross-module
  aliases use root barrels; internal paths stay relative and extensionless;
  redundant paths, explicit alias `/index`, and trailing slashes are rejected.
  Keep semantic alias order and type-only import conventions.
- [x] Split ESLint by file role: shared shell gates, non-index import rules,
  pure re-export `index.ts` barrels, and named exports except `App.tsx`.
  React uses named imports; meaningful named aliases remain allowed.
- [x] Consolidate import discipline: static imports first, grouped sorting,
  spacing, duplicate detection, and default-name alignment; reject namespace
  imports, empty blocks, redundant aliases, escaped sources, attributes,
  dynamic imports, and comments inside/between imports. Header comments
  remain flush above the import block; directive prologues stay supported.
- [x] Replace Prettier with Oxfmt 0.72.0; scope formatting to `main.tsx` and
  `App.tsx`, preserve import/package sorting ownership, and add format checks
  to repository tests. Configure local Zed formatting; live editor check pending.
- [x] Verify earlier shell/state/hotkey/import changes with targeted checks
  and repository tests; preserve feature/CSS policy deferrals.
- [x] Seed from `feat/spirit` at `ce368be9` after PR #42 squash merge.
