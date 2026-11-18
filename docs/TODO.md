# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

- [ ] Preview `bosquet.dark.dominant` (Pine `yunshanlv`, `#15231b`) on the
      window header in WKWebView and refine the dark palette; confirm
      `unstable_defineVarsNested` resolves in development mode.

## Planned

- [ ] `cursor` / `userSelect`: confirm the unprefixed `user-select` takes
      effect in WKWebView.
- [ ] `display` / `flexShrink`: confirm the header layout role inside
      `MainLayout`.
- [ ] `position` / `zIndex` / `isolation`: settle the header stacking level
      against `SettingsModal` (`z-100`); drop `isolation` if redundant.

## Completed

- [x] Moved `windowHeaderStyles.root.backgroundColor` to the StyleX semantic
      token `colorTokens.headerBg` with the `vine` default. Verified the token
      definition and its use in the Rsbuild production CSS.
- [x] Layered the header color as palettes → theme → token: Vine and Pine in
      `styles/palettes/`, Bosquet maps `light`/`dark` to the `dominant` role via
      `unstable_defineVarsNested`, and `colorTokens.headerBg` reads
      `bosquet.light.dominant`. Verified the variable chain in the Rsbuild
      production CSS.
