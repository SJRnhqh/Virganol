# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

- [ ] `userSelect`: confirm the unprefixed `user-select` takes effect in
      WKWebView.

## Planned

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
- [x] Moved `WindowsWindowControls` into the header flex layout and removed
      the `7.25rem` clearance. Removed trailing padding from the button group
      and the Windows header. Confirmed the edge alignment on Windows.
- [x] Removed `position: relative` from the header root. The Windows controls
      now occupy their own space, and the breadcrumb dropdown is positioned
      relative to the breadcrumb container.
