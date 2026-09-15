# Branch TODO

- Branch: `feat/spirit-ui-cleanup`
- Parent: `feat/spirit`
- Goal: Normalize and clean the frontend shell layer (`apps/ui/src` outside
  `features/`).

## Current

- [ ] Use `layouts/` as the entry point to map ownership of each rendered
  content region, then align layouts, components, and features around a
  one-way dependency model.

## Planned

- [ ] Decide whether feature-only base components should move into their
  owning features or into a future shared UI layer.
- [ ] Deep-normalize the pending styles files: `canvas.css`, `tokens.css`,
  `scrollbars.css`, `themes/_palette.css`, and `themes/light.css`. Only
  `index.css`, `themes/index.css`, and `base.css` are normalized so far.
- [ ] Align feature internals after the outer dependency boundaries are
  settled.
- [ ] Complete the UI Node built-in import guard: reject both `node:*`
  specifiers and bare built-in names or subpaths, and add an ESLint config
  probe.

## Completed

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
