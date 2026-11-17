# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

- [ ] Evaluate dark color schemes using the header background token before
      settling how to organize theme palettes.

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
