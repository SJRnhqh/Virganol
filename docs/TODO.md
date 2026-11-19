# Branch TODO

- Branch: `feat/spirit-ui-style-header-root`
- Parent: `feat/spirit`
- Goal: Settle the remaining `windowHeaderStyles.root` fields in
  `apps/ui/src/styles/header.ts`, one field group at a time.

## Current

## Planned

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
- [x] `userSelect`: kept `none` on the header root to prevent accidental text
      selection across the title bar.
- [x] `height`: PR #44 established the default `2rem` and pre-Tahoe macOS
      `1.75rem` heights to align with the native title bar.
- [x] `zIndex`: kept `9999` for now. Revisit the header's stacking order
      relative to the workspace and settings overlay during the header redesign.
- [x] Enforced alphabetical JSX prop order with `perfectionist/sort-jsx-props`
      (`eslint-plugin-perfectionist@5.5.0`), carrying over the core of the
      stashed `react/jsx-sort-props` setup with a lighter dependency footprint.
- [x] Upgraded StyleX to 0.19.2 and switched the unplugin adapter back to
      `stylex.rspack()`. Verified the production CSS. Kept `runtimeInjection` in
      development: with it off the extracted CSS rebuilds, but the hot update
      carries only the JS chunk.
- [x] Verified development hot updates in headless Chrome: palette hex values
      (`defineConsts`) hot-update through StyleX runtime constant injection
      (facebook/stylex#1334); `defineVars` mapping changes still need a page
      reload, since runtime injection deduplicates rules by selector.
