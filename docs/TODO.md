# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

- [ ] `position`: examine `WindowsWindowControls`, the only child relying on
      the header's `position: relative` (`absolute right-0 top-0 h-full`), and
      its `controlsWindows` `marginRight: 7.25rem` clearance; decide whether the
      controls should become a regular flex child.

## Planned

- [ ] `userSelect`: confirm the unprefixed `user-select` takes effect in
      WKWebView.
- [ ] `zIndex`: keep while the `Breadcrumb` dropdown overflows onto the
      workspace; revisit the value against `SettingsModal` (`z-100`) when the
      breadcrumb is redesigned.
- [ ] Refine the Pine dark palette once StyleX hot updates cover variable
      values.

## Completed

- [x] Moved `windowHeaderStyles.root.backgroundColor` to the StyleX semantic
      token `colorTokens.headerBg` with the `vine` default. Verified the token
      definition and its use in the Rsbuild production CSS.
- [x] Layered the header color as palettes → theme → token: Vine and Pine in
      `styles/palettes/`, Bosquet maps `light`/`dark` to the `dominant` role via
      `unstable_defineVarsNested`, and `colorTokens.headerBg` reads
      `bosquet.light.dominant`. Verified the variable chain in the Rsbuild
      production CSS.
- [x] Previewed `bosquet.dark.dominant` on the window header in WKWebView by
      swapping the token value; confirmed `unstable_defineVarsNested` resolves
      in development mode.
- [x] `cursor`: kept `default` to state the title-bar cursor explicitly instead
      of relying on the `userSelect` side effect.
- [x] `display` / `flexShrink`: kept; `flex` underpins `alignItems` and the
      controls' `marginLeft: auto`, and `flexShrink: 0` guards the header height
      inside the `MainLayout` column.
- [x] `isolation`: kept to contain the header's internal layers; redundant with
      `zIndex` for now but stays in effect if `zIndex` is dropped.
