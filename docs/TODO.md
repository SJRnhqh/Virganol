# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Polish the frontend shell under `ROADMAP.md` 6.5; current focus is
  layouts and the incremental StyleX migration.

## Current

- [ ] Scaffold a dev preview entry with a stubbed native bridge so MainLayout
  and real child components render in the plain browser; reuse it to verify
  MainLayout in Tauri, including native hot updates.
- [ ] Advance the ROADMAP 6.5 per-part walk; current pointer:
      MacTrafficLightSpacer (60 magic number, motion params, JSDoc).

## Planned

- [ ] Follow [StyleX #1745](https://github.com/facebook/stylex/pull/1745):
  the Rspack CSS-output fix merged on 2026-09-24, after the installed 0.19.1
  release. Upgrade to a release containing it, verify CSS output/HMR, and
  replace the temporary `.webpack()` adapter with `.rspack()`. The fix covers
  initial CSS output; it does not establish that hot updates work. Checked
  2026-11-03: npm latest `@stylexjs/unplugin` is still 0.19.1 (2026-09-15),
  so the fix is unreleased and the wait continues; `@rsbuild/core` 2.3.0
  exists but is unrelated to the adapter switch.
- [ ] Land the full styles ESLint reconciliation when warranted: the minimal
  knife (components depending on styles, like layouts) is already in; the
  full knife (styles in `moduleDirs`, `styles: []` leaf key, index entry
  patterns) stays deferred until styles files multiply.
- [ ] Optionally improve Zed's duplicate-import quick-fix around file-header
  comments. Format-on-save is verified live; nothing here blocks the StyleX
  pilot.
- [ ] Revisit sidebar/module CSS scoping (`@scope`, `@layer`, BEM) after
  component boundaries emerge and the StyleX pilot is evaluated.
- [ ] Align `MainStage` with `NavId` and derived props under `types/props/`;
  consider deriving `NavId` from `NAV_IDS as const`.
- [ ] After the sidebar slice, decide whether settings needs `toggle`;
  recheck that bare `open` retains the last tab.
- [ ] Keep `ModuleMenu` and `Breadcrumb` scaffolding parked pending a
  decision.
- [ ] Extend boundary/import policies into `features/` through the
  reverse-waterfall review; stylesheet import policy remains deferred.
- [ ] Update `docs/rules/` once ESLint coverage and conventions settle
  across the frontend. Persistent import-rule regression scripts remain
  deferred at the user's request.

## Completed

- [x] Migrate WindowHeader's styles to StyleX as the first component-level
  slice: new `styles/header.ts` (`windowHeaderStyles`, theme colors via
  `var(--header-bg)`/`var(--sidebar-border)`, responsive padding via media
  conditionals) exported through the styles barrel; WindowHeader swaps
  `cn`/Tailwind classes for `props()` composition with the `controlsWindows`
  conditional mirroring `workspaceRight`. Boundary legislation is the minimal
  one-line knife: `components` now depends on `styles` exactly like `layouts`
  does; the full reconciliation (moduleDirs key, index entry patterns) stays
  deferred. Lint, type check, and the production build pass.
- [x] Extend oxfmt coverage to the settled lib platform entries:
  `lib/index.ts` (first pass collapsed the animation re-export to one line)
  and `lib/platform.ts`; both files are already fully ESLint-gated (import
  discipline on the module, barrel rules on the index), so the two now carry
  the same format seal as the other settled entries. Format checks pass on 9
  files.
- [x] Replace the inherited `osType` Promise bug with synchronous UA detection
  in `lib/platform.ts`: `type()` returns a promise, so the old `useState` probe
  stored a promise and `isMac`/`isWindows` were permanently false, leaving both
  platform parts unrendered. Public surface is the two booleans; the platform
  union stays inlined in the detector signature (lib cannot import `types` and
  there is no second consumer yet), and the detector sits below the public
  constants behind a hoisted function declaration.
- [x] Extend oxfmt coverage to the settled header entries:
  `components/index.ts`, `header/index.ts`, and `header/WindowHeader.tsx`
  (first pass folded its cleaned JSX to the 100-col width). Header part files
  stay outside until each is reviewed; format checks pass on 7 files.
- [x] Generalize the comment-placement rule: rename `local/no-import-comments`
  to `local/no-comment-placement`, lift its seating from the barrel-excluded
  branch to the shared `srcFiles` block (one declaration, barrels included),
  extract a shared first-statement flush check, and add the export-side
  counterpart guarded by `body[0]` so component JSDoc stays exempt. Probed
  both sides (import header gap, barrel export gap); the full ESLint suite
  passes. Interior/trailing bans for re-exports stay a one-line TBD.
- [x] Move `WindowHeader` out of `workbench` into the lowercase semantic
  folder `components/header` (files keep PascalCase, path header comments
  updated, barrel stays tight: only `WindowHeader` exported). Seating follows
  the `settings` pattern: lowercase domain folders at `components` top level;
  whether `workbench` retires or renames stays deferred until the remaining
  parts settle.
- [x] Add `import-x/no-self-import` to the import gates: a file importing
  itself (the rename/copy-paste slip) is now lint-rejected; barrel-mediated
  cycles remain out of scope for now. Probed once to confirm the error
  fires; the full ESLint suite passes with zero existing usage.
- [x] Add `import-x/no-webpack-loader-syntax` to the import gates: inline
  webpack loader chains (`!`-separated import sources) are lint-rejected
  while Rsbuild query suffixes stay unaffected. Probed once to confirm the
  error fires; the full ESLint suite passes with zero existing usage.
- [x] Swap core `no-duplicate-imports` for `import-x/no-duplicates` with
  `"prefer-inline": true`: same detection, plus an autofix that merges
  same-source imports in the project's inline-type style. Verified on
  MainLayout with seeded duplicates — the old rule reported without fixing,
  the new rule merges on `--fix`; detection and CI behavior are unchanged
  and the full ESLint suite passes.
- [x] Bring `layouts/**` under oxfmt via the `.oxfmtrc.json` allowlist so
  fixer output and hand edits normalize to canonical form; MainLayout's
  first pass collapsed a props spread to one line and dropped non-ES5
  trailing commas. Add a matching `TypeScript` block to Zed settings so
  `.ts` files format on save too, confirm live format-on-save, keep
  `printWidth` at 100, and admit `.zed/settings.json` into the repo with a
  selective `.gitignore` un-ignore while local overrides stay ignored.
- [x] Add the `^@/styles` group to `simple-import-sort` between `@/hooks` and
  `@/features`, matching the seated styles layer; autofix moves the `@/styles`
  import in `MainLayout.tsx` above `@/components`, and the full ESLint suite
  passes.
- [x] Seat the `styles` boundary element between `hooks` and `features` in
  `boundaries/elements`, expressing the TS-ified styles layer as a leaf below
  feature domains; first-match disambiguation is unaffected and the full
  ESLint suite passes with zero behavior change.
- [x] Add `tsc -b` to the TS test suite so CI type-checks the UI and fails on
  unresolved imports; rely on `tsc` for module resolution instead of enabling
  `import-x/no-unresolved`. The TS suite and type check pass.
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
