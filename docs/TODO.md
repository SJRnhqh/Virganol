# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

- [ ] `backgroundColor`: confirm the `var(--header-bg)` source and whether
      StyleX should reference it directly or through `defineVars`.

## Planned

- [ ] `cursor` / `userSelect`: confirm the unprefixed `user-select` takes
      effect in WKWebView.
- [ ] `display` / `flexShrink`: confirm the header layout role inside
      `MainLayout`.
- [ ] `position` / `zIndex` / `isolation`: settle the header stacking level
      against `SettingsModal` (`z-100`); drop `isolation` if redundant.

## Completed
