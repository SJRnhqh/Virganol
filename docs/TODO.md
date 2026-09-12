# Branch TODO

- Branch: `feat/spirit-ui-cleanup`
- Parent: `feat/spirit`
- Goal: Normalize and clean the frontend shell layer (`apps/ui/src` outside
  `features/`).

## Current

- [ ] Audit and normalize the shell layer: boundaries, dead code, and
  conventions.

## Planned

- [ ] Normalize `components/` boundaries and barrel exports.
- [ ] Normalize `hooks/` boundaries and imports.
- [ ] Deep-normalize the pending styles files: `canvas.css`, `tokens.css`,
  `scrollbars.css`, `themes/_palette.css`, and `themes/light.css`. Only
  `index.css`, `themes/index.css`, and `base.css` are normalized so far.
- [ ] Align `features/` (only if diff budget remains; scope TBD).

## Completed

- [x] Add root UI lint and auto-fix commands; consolidate ESLint shell-layer
  path matching.
- [x] Normalize shell imports through public aliases and organize library barrel
  exports.
- [x] Expose settings values through the types barrel and extend export sorting
  to `types/` and `constants/` indexes.
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
