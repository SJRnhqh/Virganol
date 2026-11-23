# Branch TODO

- Branch: `feat/spirit-ui-header-controls`
- Parent: `feat/spirit`
- Goal: Refine `SideSwitch`, `SidebarToggle`, and `SettingsButton` in the
  `WindowHeader` controls group. Simplify their state subscriptions,
  event handling, and styles while preserving their existing behavior.

## Current

- [ ] Review the pending SideSwitch changes and gradually refine the button
      toward the shared header control pattern: selector subscription, shared
      StyleX shell, icon registry, and comment style.

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
- [ ] Review the remaining mouse-down and double-click interception in
      `SidebarToggle` and `SettingsButton` against the `WindowHeader` guards.
      Verify that clicking or double-clicking the controls does not start
      dragging or toggle window maximization.
- [ ] Verify keyboard operation, accessible button names, sidebar switching
      and toggling, and context-aware settings on macOS and Windows. Run
      `pnpm test`.

## Completed

- [x] Guard the `WindowHeader` double-click by event target, matching the
      mouse-down check. Only the header surface toggles maximization.
