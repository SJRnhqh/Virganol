# Branch TODO

- Branch: `feat/spirit-ui-header-windows-controls`
- Parent: `feat/spirit`
- Goal: Refine `WindowControls` in
  `apps/ui/src/components/header/WindowControls.tsx` through an elegant
  refactor and a style field review.

## Current

- [ ] Style review: finish the shared button fields, then review the per-button
      hover backgrounds and `windowControlsIconsStyles`. Verify the shared root
      layout and default icon legibility on Windows. Review the remaining legacy
      CSS color variables alongside the StyleX token mapping.

## Planned

- [ ] Button behavior: review double-click bubbling to the header and button
      semantics (`type`, accessible labels).
- [ ] Compatibility: verify Windows 11 snap layouts on the custom maximize
      button and determine whether native window integration is needed.

## Completed

- [x] Retention: keep custom window controls in the unified header while native
      Windows decorations remain disabled.
- [x] Naming: use `WindowControls` without a platform prefix; rename the file,
      export, and call site, update the source path header and roadmap reference,
      and add bilingual component JSDoc.
- [x] StyleX: replace the Tailwind class strings with `windowControlsStyles`
      slices for the root, shared button, and per-button hover backgrounds;
      preserve dimensions, semantic CSS colors, hover-capability conditions,
      and transitions while leaving behavior unchanged.
- [x] Button color feedback uses the Bosquet light theme through StyleX tokens.
      The default icon uses the provisional summer cloud gray `buoy` and
      switches immediately to cyan grey `anchor` on hover-capable devices.
- [x] Root styles: review the `WindowControls` root and extract `alignItems`,
      `display`, and `flexShrink` into `headerSharedStyles.root`. Compose the
      shared style in `WindowHeader` and `WindowControls` and keep their height
      rules in their respective roots.
- [x] Edge alignment: rename the Windows-only header override to
      `windowEdgeAlignment` to describe how the window controls sit against the
      window edge.
- [x] Comments: align the component JSDoc with the concise bilingual style of
      `App`, `main`, `MainLayout`, and `WindowHeader`.
- [x] Props: extract `WindowControlsProps` to `types/props/header.ts` and expose
      it through the props and types public entries.
- [x] Signatures: declare `JSX.Element` returns for `App`, `MainLayout`,
      `WindowHeader`, and `WindowControls`; explicitly type `hostPlatform` as
      `OsType | "unknown"` and `hostVersion` as `string`, while retaining
      inference for internal callbacks.
- [x] Handlers: extract mouse-down, minimize, maximize-toggle, and close handlers
      before JSX; resolve the current window inside action handlers instead of
      during rendering.
- [x] Animation: replace the animated wrapper with a plain `div` so the controls
      appear immediately on mount. Keep the existing button hover feedback.
- [x] Icons: expose the four Lucide glyphs through `windowControlsIcons` and
      pair that export with `windowControlsIconsStyles`, a separate StyleX group
      for SVG sizes and stroke width. Align their bilingual JSDoc and include
      the icons layer in ESLint boundary checks and formatting.
- [x] Checks: include `WindowControls.tsx` in the temporary ESLint refinement
      scope and oxfmt allowlist.
