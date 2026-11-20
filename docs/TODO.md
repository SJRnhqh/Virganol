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

- [ ] Refactor: move the Tailwind `baseBtnClass` string and per-button hover
      classes to StyleX slices consistent with `windowHeaderStyles`.
- [ ] Fields: review and record the purpose of each resulting style field
      (sizing, alignment, radius, colors, transitions), one group at a time,
      verified on Windows.
- [ ] Compatibility: verify Windows 11 snap layouts on the custom maximize
      button and determine whether native window integration is needed.

## Completed

- [x] Retention: keep custom window controls in the unified header while native
      Windows decorations remain disabled.
- [x] Naming: use `WindowControls` without a platform prefix; rename the file,
      export, and call site, update the source path header and roadmap reference,
      and add bilingual component JSDoc.
