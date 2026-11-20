# Branch TODO

- Branch: `feat/spirit-ui-header-windows-controls`
- Parent: `feat/spirit`
- Goal: Refine `WindowControls` in
  `apps/ui/src/components/header/WindowControls.tsx` through an elegant
  refactor and a style field review.

## Current

- [ ] Refactor: tidy the component structure and behavior, including but not
      limited to the always-mounted `AnimatePresence` wrapper, the per-render
      `getCurrentWindow()` call, the inline drag-guard `onMouseDown`, double-click
      bubbling to the header, and button semantics (`type`, accessible labels).

## Planned

- [ ] Fields: review and record the purpose of each resulting style field
      (sizing, alignment, radius, colors, transitions), one group at a time,
      verified on Windows; review the legacy semantic CSS color variables
      alongside the StyleX token mapping.
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
- [x] Comments: align the component JSDoc with the concise bilingual style of
      `App`, `main`, `MainLayout`, and `WindowHeader`.
- [x] Props: extract `WindowControlsProps` to `types/props/header.ts` and expose
      it through the props and types public entries.
