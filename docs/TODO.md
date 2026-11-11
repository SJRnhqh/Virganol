# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

- [ ] `backgroundColor`: use it as the entry point to rework theme color
      management. Reference direction (not final): declare semantic tokens
      with StyleX `defineVars` using literal `--*` names as the built-in
      default theme, add alternates via `createTheme`, and map community
      palettes onto the same keys, so Tailwind keeps reading the variables
      and runtime custom themes can override them later.
  - [ ] Step 1: verify a minimal `tokens.stylex.ts` with a single
        `--header-bg` literal key builds under Rsbuild and drives
        `windowHeaderStyles.root.backgroundColor`.

## Planned

- [ ] `cursor` / `userSelect`: confirm the unprefixed `user-select` takes
      effect in WKWebView.
- [ ] `display` / `flexShrink`: confirm the header layout role inside
      `MainLayout`.
- [ ] `position` / `zIndex` / `isolation`: settle the header stacking level
      against `SettingsModal` (`z-100`); drop `isolation` if redundant.

## Completed
