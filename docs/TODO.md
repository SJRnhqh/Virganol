# Branch TODO

- Branch: `feat/spirit-ui-header-controls`
- Parent: `feat/spirit`
- Goal: Refine `SideSwitch`, `SidebarToggle`, and `SettingsButton` in the
  `WindowHeader` controls group. Simplify their state subscriptions,
  event handling, and styles while preserving their existing behavior.

## Current

- [ ] Review the three controls and their wrapper. Identify which state each
      control reads, which styles they share, and which event handlers they
      need to coexist with the draggable header.

## Planned

- [ ] Narrow `SideSwitch` and `SidebarToggle` subscriptions to the state and
      actions each control uses. Preserve sidebar placement, visibility, and
      icon feedback.
- [ ] Simplify `SettingsButton` props and click handling. Check whether the
      optional `onClick` override has callers and preserve context-aware
      settings navigation.
- [ ] Move the controls to StyleX and reuse existing header styles and tokens
      where appropriate. Review group spacing, icon sizing, and hover and
      focus feedback.
- [ ] Review mouse-down and double-click propagation against `WindowHeader`.
      Verify that clicking or double-clicking the controls does not start
      dragging or toggle window maximization.
- [ ] Verify keyboard operation, accessible button names, sidebar switching
      and toggling, and context-aware settings on macOS and Windows. Run
      `pnpm test`.

## Completed
