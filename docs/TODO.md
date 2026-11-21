# Branch TODO

- Branch: `feat/spirit-ui-header-windows-controls`
- Parent: `feat/spirit`
- Goal: Refine `WindowControls` in
  `apps/ui/src/components/header/WindowControls.tsx` through an elegant
  refactor and a style field review.

## Current

## Planned

## Completed

- [x] Review window state ownership. Keep one resize listener in
      `WindowHeader` through `useWindowState` and pass `isMaximized` to
      `WindowControls`. Defer platform-specific queries to the [roadmap](ROADMAP.md#65-收尾优化).
- [x] Upgrade pnpm to `12.21.0` and have CI read the version from
      `package.json`. Verify a clean frozen-lockfile install, the UI build,
      and all repository test suites with the existing Node.js version.
- [x] Verify the legibility of the 16 × 16 px window control icons, the shared
      root layout, and hover feedback on Windows.
- [x] Verify that double-clicking the window controls does not trigger the
      header's maximize toggle in the temporary macOS preview.
- [x] Remove the redundant `mousedown` propagation guard from `WindowControls`.
      `WindowHeader` already starts dragging only when the header itself is
      the event target.
- [x] Establish provisional Bosquet Light and Dark palettes with separate
      `tonic` (title bar) and `dominant` (main content) color roles. Review
      window control colors alongside the title bar and main content background
      in a visual palette preview. Keep Light as the default; defer main
      content wiring.
- [x] Upgrade the UI's direct `lucide-react` dependency to `1.77.0`.
- [x] Use `Minus`, `Square`, `RestoreWindow`, and `X` for the Windows caption
      buttons. Define the custom restore glyph in `icons/RestoreWindow.ts`.
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
