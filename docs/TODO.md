# Branch TODO

- Branch: `feat/spirit-ui-header-windows-controls`
- Parent: `feat/spirit`
- Goal: Refine `WindowsWindowControls` in
  `apps/ui/src/components/header/WindowsWindowControls.tsx` through a
  retention decision, an elegant refactor, and a style field review.

## Current

- [ ] Retention: decide whether to keep the custom Windows controls, given that
      `container/windows/appearance.rs` disables native decorations
      (`set_decorations(false)`); weigh the unified header against native
      behavior such as Windows 11 snap layouts on the maximize button.

## Planned

- [ ] Refactor: tidy the component structure and behavior, including but not
      limited to the always-mounted `AnimatePresence` wrapper, the per-render
      `getCurrentWindow()` call, the inline drag-guard `onMouseDown`, button
      semantics (`type`, accessible labels), and the missing JSDoc.
- [ ] Refactor: move the Tailwind `baseBtnClass` string and per-button hover
      classes to StyleX slices consistent with `windowHeaderStyles`.
- [ ] Fields: review and record the purpose of each resulting style field
      (sizing, alignment, radius, colors, transitions), one group at a time,
      verified on Windows.

## Completed
