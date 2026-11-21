# Branch TODO

- Branch: `feat/spirit-ui-header-windows-controls`
- Parent: `feat/spirit`
- Goal: Refine `WindowControls` in
  `apps/ui/src/components/header/WindowControls.tsx` through an elegant
  refactor and a style field review.

## Current

- [ ] Lucide glyph selection: compare alternatives to `Minus`, `Maximize2`,
      `Minimize2`, and `X` at 16 × 16 px with Lucide's default stroke width.
      Choose glyphs for minimize, maximize, restore, and close. Verify their
      legibility, the shared root layout, and hover feedback on Windows.
- [ ] Button behavior: review double-click bubbling to the header and button
      semantics (`type`, accessible labels).
- [ ] Compatibility: verify Windows 11 Snap Layouts on the custom maximize
      button and determine whether native window integration is needed.

## Planned

- [ ] Theme review: finalize the provisional window control colors alongside
      the Bosquet title bar and main content background.

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
- [x] Window button hover backgrounds use the Bosquet `prelude`, `interlude`,
      and `coda` roles in yellow, green, and red order. Migrate the original
      color values to the Vine palette and remove the old CSS aliases.
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
      share one 16 × 16 px StyleX size and Lucide's default stroke width.
      Align the bilingual JSDoc and include the icons layer in ESLint boundary
      checks and formatting.
- [x] Checks: include `WindowControls.tsx` in the temporary ESLint refinement
      scope and oxfmt allowlist.
