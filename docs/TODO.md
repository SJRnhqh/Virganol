# Branch TODO

- Branch: `feat/spirit-ui-polish`
- Parent: `feat/spirit`
- Goal: Polish the frontend shell under `ROADMAP.md` 6.5. MainLayout-facing
  store and hotkeys reviews are complete. The import region is fully locked:
  zero comments inside or between declarations, flush comments above the
  first import (directive prologues covered), and bounded blank lines; next
  decide entry re-export gating, then continue the default-import policy,
  CSS experiments, and the layouts review.

## Current

- [ ] Next: decide whether to gate plain entry re-exports (`export ... from`)
  in `main.tsx` and `App.tsx` beyond the already-rejected attribute variants,
  or drop the restriction as theoretical. Existing `no-restricted-syntax`
  selectors for `ExportNamedDeclaration[source]` and `ExportAllDeclaration`
  would cover it entry-scoped without new dependencies; the unused
  `react-dom/client.js` spelling passes ESLint but stays rejected by
  TypeScript/package resolution.
- [ ] Revisit default-object imports alongside the overall default
  export/import policy; keep feature/CSS import policy decisions deferred.
- [ ] Evaluate CSS beyond direct Tailwind classes with a small layout prototype:
  PandaCSS, vanilla-extract, and StyleX; compare authoring, type/theme contracts,
  generated output, and migration effort.
- [ ] Review the layouts layer: structure, logic, types, comments, and styling;
  continue down the shell as each layer is reviewed.

## Planned

- [ ] Verify Zed format-on-save; this editor check does not block CSS discussion.
- [ ] Optionally improve duplicate-import autofix. Duplicate imports already
  fail the core rule; automatic merging is not a CSS prerequisite. The existing
  `import-x/no-duplicates` can fix simple cases but declines the tested case
  containing the `main.tsx` file-header comment.
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
  `ModuleMenu` and `Breadcrumb` scaffolding pending a decision.
- [ ] Extend the boundaries gate into `features/` via reverse-waterfall
  review.
- [ ] Align TypeScript style documentation with the enforced ESLint policies
  after rule coverage reaches the full frontend; defer `docs/rules/` edits
  meanwhile and document the finalized project conventions together.

## Completed

- [x] Cover directive prologues and positional wording in
  `local/no-import-comments`. The first-import check now triggers on the
  first `ImportDeclaration` in the top-level body (`slice().some(...)` scan)
  instead of requiring the import to be the file's first statement, so
  `"use client"; /* note */ import ...` reports `moveComment` and
  blank-separated leading comments report `keepCommentFlush`; the renamed
  message drops the "file header" assumption and reads "Keep this comment
  flush with the first import.", keeping misplaced-import noise accurate.
  Comments above a directive remain body-domain and unregulated. Directive
  same-line/blank, renamed-message, flush, and misplaced-import probes
  passed, along with full UI ESLint and repository `pnpm test`.
- [x] Lock the import region top and tail boundaries in
  `local/no-import-comments`. The first import now checks the last comment
  above it: same-line leading comments report `moveComment`, a gap of two or
  more lines reports `keepHeaderFlush`, and exactly one line stays flush;
  header block internals stay free-form. Imports followed by a non-import
  statement check `getCommentsAfter` for same-line trailing comments so the
  block tail stays comment-free, while non-last imports keep coverage through
  the between-imports check. Body comments, blank-line duties of
  `newline-after-import`, and directive prologues stay out of scope. Probes
  covered same-line leading, blank and multi-blank headers, multi-line
  flush headers, trailing comments on last and non-last imports, an
  EOF-only import, and mixed same-line statements; full UI ESLint and
  repository `pnpm test` passed.
- [x] Reject comments between adjacent imports across the non-features shell
  scope by extending the local `local/no-import-comments`: report comments
  between consecutive top-level imports via a previous-sibling check plus
  `getCommentsBefore`, keep the in-declaration check, and unify both messages
  to "Move this comment above the import block." Header comments above the
  block and body comments after it stay allowed. This removes the contested
  layout zone between `import-x/newline-after-import` and
  `simple-import-sort`, closing the circular-fix defect for compliant code
  without restoring Stylistic or changing spacing rules; `--fix` on already
  rejected code can still warn and stays gated by the error. Probes covered
  line/block/multiline between-import comments, the in-declaration
  regression, and header/after-block negatives; full UI ESLint and repository
  `pnpm test` passed.
- [x] Reject comments inside static import declarations with the local ESLint
  `local/no-import-comments` error across the non-features shell scope.
  Use `getCommentsInside` and report the comment location with guidance to
  move it above the import; cover inline/multiline, default/type/side-effect
  imports without adding dependencies or an autofix. Leading, trailing,
  and body comments remain outside this rule. After restoring the original
  spacing rule, twelve rule/scope checks, CLI failure/success probes, and
  repository `pnpm test` passed. The old spacing rule can still add its own
  diagnostic for an invalid internal comment; that issue remains deferred.
  This is an ESLint diagnostic, not a TypeScript compiler error.
  The persistent regression script and test-gate integration are deferred
  at the user's request; retain the ESLint rule itself.
  Static re-exports and out-of-scope files remain unregulated by this rule;
  standard `eslint-disable` directives can suppress it, as with other rules.
- [x] Reject quoted imported names across the non-features shell scope with
  the existing `no-restricted-syntax` selector
  `ImportSpecifier > Literal.imported`; cover value and type imports while
  preserving ordinary named aliases, source strings, and CSS side effects.
  In-memory trial, actual-config positive/negative and scope checks, full UI
  ESLint, and repository `pnpm test` passed. The rule reports without autofix;
  non-identifier export names such as `"foo-bar"` are also disallowed on import.
- [x] Retain meaningful named import aliases for naming conflicts; keep
  `no-useless-rename` for redundant aliases without adding a blanket ban.
- [x] Keep default import names aligned with resolvable default export names
  across the non-features shell scope using `import-x/no-rename-default`;
  include `.ts`/`.tsx` in `import-x/extensions` so export analysis reaches
  TypeScript modules. Valid/renamed-default/named-alias and scope probes,
  full UI ESLint, and repository `pnpm test` passed. The rule reports without
  autofix; named aliases remain allowed and anonymous defaults have no name
  to enforce.
- [x] Reject empty named import blocks (`import {} from "x"` and
  `import type {}`) across the non-features shell scope with
  `import-x/no-empty-named-blocks`; pure empty blocks report without
  autofix and offer editor suggestions (drop the whole statement or keep
  the side-effect spelling), while stray empty braces in mixed statements
  auto-fix away. Empty/named/side-effect probe checks, full UI ESLint,
  and repository tests passed.
- [x] Drop the parked `Breadcrumb` commented `ModuleMenu` import, promote
  `import-x/newline-after-import` from entries to the shell scope, and
  dissolve the now-empty entry config block; the entry files keep every
  check through the shared shell scope. Store/entry probe checks, the
  Breadcrumb file check, and repository tests passed.
- [x] Promote `no-useless-rename` and the import-source escape/continuation
  selector from the entry block into the shared shell scope without touching
  parked sources; keep `newline-after-import` entry-scoped because the parked
  `Breadcrumb` commented import would trip it. Entry/store probe checks and
  repository tests passed.
- [x] Reject import attributes (`with {}` / legacy `assert {}`) on imports
  and re-exports across the non-features shell scope with existing
  `no-restricted-syntax`. TS-parser nodes always carry `attributes`, so the
  selectors require `[attributes.length>0]`; plain imports, CSS side-effect
  imports, and attributeless `index.ts` re-exports stay unaffected, and
  repository tests passed.
- [x] Reject dynamic `import()` expressions across the non-features shell
  scope with existing `no-restricted-syntax`; espree 10.4 parses `import()`
  as a standalone `ImportExpression` node, so legacy
  `CallExpression[callee.type=...]` selectors no longer match. Store-layer
  and variable-argument checks are rejected, features stays deferred, and
  repository tests passed.
- [x] Confirm `simple-import-sort` already fixes import-block blank lines
  uniquely (zero within a group, exactly one between groups); revert the
  `padding-line-between-statements` trial after a live autofix conflict
  (`ESLintCircularFixesWarning`) with no source or config change.
- [x] Reject import-source line continuations in `main.tsx` and `App.tsx`
  with existing `no-restricted-syntax`; retain deferred feature/CSS targets.
  Thirty source/scope checks, a report-only autofix check, full UI ESLint,
  and the entry Oxfmt check passed.
- [x] Extend the existing internal shell/root script-extension gate to reject
  `.js` / `.jsx` in imports and re-exports; retain extensionless paths and
  deferred feature/CSS targets. Scope/error checks and repository `pnpm test`
  passed; the boundaries rule reports errors without autofix.
- [x] Require exactly one empty line after the import block in `main.tsx`
  and `App.tsx`, including following comments, with existing
  `import-x/newline-after-import`; autofix missing separators and let Oxfmt
  collapse extras. Scope/fix/stability checks and repository tests passed.
- [x] Reject Unicode/hex escapes in `main.tsx` and `App.tsx` import sources;
  defer features/CSS. Scope checks and repository tests passed.
- [x] Reject redundant import aliases in `main.tsx` and `App.tsx`;
  keep meaningful aliases. Scope/autofix checks and repository tests passed.
- [x] Remove ESLint's `comma-spacing` gate; retain Oxfmt's two-entry scope.
  Repository tests passed.
- [x] Limit Oxfmt to `apps/ui/src/main.tsx` and `apps/ui/src/App.tsx`;
  retain the root configuration and existing formatting options.
- [x] Add UI/root `format` and `format:check`; include the read-only check
  in `pnpm test` for pre-commit and CI. Scope/failure checks and tests passed.
- [x] Configure local Zed TSX format-on-save with Oxfmt and retain `vtsls`;
  workspace settings stay ignored and JSON validation passed.
- [x] Replace Prettier with Oxfmt 0.72.0, preserving the six formatting
  options and 22 ignore patterns in `.oxfmtrc.json`. Disable import and
  package.json sorting to retain existing behavior; formatting remains
  opt-in, with no new lint/commit gate or source reformatting. Ten output
  comparisons against Prettier 3.8.3, eleven ignored-path checks, CLI
  acceptance/rejection checks, and repository `pnpm test` passed.
- [x] Reject namespace imports with existing `import-x/no-namespace` within
  the current shell/root lint scope. Keep named import aliases available for
  naming conflicts. Full UI ESLint, four in-memory namespace/alias checks,
  and repository `pnpm test` passed; feature source coverage remains deferred.
- [x] Keep static imports before other statements using `import-x/first` and
  reject `EmptyStatement` through existing `no-restricted-syntax` within the
  current shell/root lint scope, preventing empty-statement sort-block splits.
  Preserve directive prologues and ordinary statement terminators; empty loop
  bodies written as `;` are also rejected. Full UI ESLint, eleven in-memory
  rule/scope checks, and repository `pnpm test` passed; feature source coverage
  remains deferred.
- [x] Require conventional default import syntax instead of `{ default as X }`
  within the current shell/root lint scope using `import-x/no-named-default`.
  Full UI ESLint, eight in-memory rule/scope checks, and repository `pnpm test`
  passed; feature source coverage remains deferred.
- [x] Reject trailing slashes in import/re-export sources within the current
  shell/root lint scope using existing `no-restricted-imports`; cover aliases,
  relative paths, packages, side-effect imports, and type imports. Full UI
  ESLint, 35 in-memory rule/scope checks, and repository `pnpm test` passed;
  feature source coverage remains deferred.
- [x] Normalize redundant shell/root relative imports and re-exports with
  `import-x/no-useless-path-segments`; share TypeScript resolver settings with
  boundaries and preserve explicit index entries.
- [x] Reject mergeable split imports in the current shell/root lint scope with
  core `no-duplicate-imports`, including separate type/value declarations.
  Full UI ESLint, six split/merged checks, and repository `pnpm test` passed;
  feature source coverage remains deferred.
- [x] Require omitted `.ts`/`.tsx` extensions within managed modules using the
  existing boundaries policy; preserve deferred feature/stylesheet targets.
  Full UI ESLint and in-memory extension/scope checks passed.
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
