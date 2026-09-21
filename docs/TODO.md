# Branch TODO

- Branch: `feat/spirit-ui-cleanup`
- Parent: `feat/spirit`
- Goal: Normalize and clean the frontend shell layer (`apps/ui/src` outside
  `features/`).

## Current

- [ ] Close out the branch: the shell normalization work is handed over to
  `ROADMAP.md` (6.5), and the uncommitted boundaries wiring stays in the
  worktree for a follow-up branch.

## Planned

- [ ] Nothing pending on this branch; see `ROADMAP.md` 6.5 for the follow-up
  queue (boundaries integration, feature governance, store normalization,
  styles deep-normalization).

## Completed

- [x] Centralize store state shapes under `types/state/` with per-domain files
  and a barrel; both stores now import their shapes from `@/types`.
- [x] Rename `components/frame` to `components/workbench`, aligning the domain
  name with the shell/workbench vocabulary and domain-peer organization.
- [x] Restructure the global shortcuts hook into `hooks/hotkeys/`: slim
  wiring-only entry, private pure `handleKeyDown`, barrel exposing only the
  hook.
- [x] Remove the `Cmd/Ctrl` + `1-7` module-switching shortcut together with
  its dead import and dependency entries.
- [x] Unify wiring order: store subscriptions before behavior hooks, and store
  subscription order matching the store barrel exports.
- [x] Ignore the ZCode-generated `.zcodeignore` artifact in git.
- [x] Extract the main-stage region from `MainLayout` into `MainStage` with its
  deck assembly and shutter transition, and privatize `DevelopingView` under
  the stage directory.
- [x] Normalize the layout shell: bilingual three-line JSDoc, export-first
  ordering with private types and helpers sunk below, and the settings overlay
  placed last in the composition.
- [x] Replace the fixed response character limit with concise, conclusion-first
  Chinese guidance that preserves key reasoning and risks and allows detail
  when needed.
- [x] Add the comma-spacing style rule to the shared UI lint block and fix the
  one existing violation.
- [x] Normalize `components/` source headers, imports, explicit barrel exports,
  and root consumers; remove unused base UI components.
- [x] Expose the bot settings provider UI through the feature root without
  changing feature internals.
- [x] Extend UI import linting to `components/`, distinguish external and
  internal side-effect imports, and prohibit `node:*` imports in UI source.
- [x] Extend lint import and barrel-export boundaries to `types/`, remove
  obsolete ownership notes, and keep its ID list private.
- [x] Expose `constants/` through its public entry, migrate `NAV_ITEMS`
  consumers, and extend its lint import boundaries.
- [x] Add the `hooks/` public entry, source headers, alias-based consumers, and
  ESLint import and export boundaries.
- [x] Normalize `lib/` source headers and import regions; extend lint path
  boundaries and document the shared `cn` utility.
- [x] Prohibit parent-relative imports in the root UI shell, `layouts/`, and
  `store/`; document the `@/` public-entry convention.
- [x] Add root UI lint and auto-fix commands; consolidate ESLint shell-layer
  path matching.
- [x] Normalize shell imports through public aliases and organize library barrel
  exports.
- [x] Expose settings values through the types barrel.
- [x] Add Stylelint to the UI quality gate and normalize the frontend package
  development version.
- [x] Split global styles into theme, token, base, canvas, and scrollbar
  responsibilities behind a single stylesheet entry point.
- [x] Normalize base style comments and body layering, deduplicate the
  Stylelint Tailwind at-rule allowlist, and trim zero-reference root lint
  passthrough scripts.
- [x] Switch Stylelint to package-wide coverage through a `.stylelintignore`
  whitelist (ignore non-CSS files, exempt `dist/`) and simplify the lint
  scripts to `stylelint .`.
- [x] Seed CSS code-style guidance for source headers, bilingual block comments,
  and index stylesheet imports; align Rust rule maturity labels.
- [x] Seed the TypeScript code-style framework for source headers, JSDoc, and
  paths; align CSS path terminology and the code-style listing order.
- [x] Centralize the product version in the Cargo workspace, inherit it across
  Rust crates, and remove duplicate frontend, desktop, and Tauri versions.
