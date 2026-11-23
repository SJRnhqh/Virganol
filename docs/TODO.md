# Branch TODO

- Branch: `feat/spirit-ui-header-controls`
- Parent: `feat/spirit`
- Goal: Refine `SideSwitchButton`, `SidebarToggle`, and `SettingsButton` in the
  `WindowHeader` controls group. Simplify their state subscriptions,
  event handling, and styles. Preserve their existing behavior except for
  the deliberate changes recorded under Completed.

## Current

- [ ] Settle the `SideSwitchButton` hover background: keep
      `var(--header-icon-bg)` or replace it with a color token. Close the
      remaining feedback points with it: where the transition lives and the
      focus styles of `headerSharedStyles.button`.

## Planned

- [ ] Review the store layer from the `SideSwitchButton` subscription: how the
      header controls select sidebar state and actions from `useSidebarStore`.
- [ ] Once the `SideSwitchButton` reviews are settled, add its file to the
      ESLint `refinedFiles` list and the matching oxfmt allowlist.
- [ ] Narrow the `SidebarToggle` subscription to the state and actions it
      uses. Preserve sidebar placement, visibility, and icon feedback.
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
- [x] Register `sideSwitchButtonIcon` in the header icon registry and move
      the 16px icon sizing into `headerSharedStyles.icon`.
- [x] Migrate `SideSwitchButton` to the header control pattern: selector
      subscription, `sideSwitchButtonStyles.root`, and the registered icon.
      The button no longer stops mouse-down or double-click propagation.
- [x] Deliberately change the side switch behavior: the icon hover rotation
      and right-side mirror are dropped, the icon is 16px, and the button
      height follows the header.
- [x] Rename the side switch component, file, icon, and styles to
      `SideSwitchButton`. Its styles use `root` for the button element.
- [x] Extract `windowControlsStyles.button` into `headerSharedStyles.button`
      between `root` and `icon`. `WindowControls` and `SideSwitchButton`
      compose it, and `sideSwitchButtonStyles.root` keeps only the hover
      background and the transition.
- [x] Deliberately change the side switch feedback: the active scale is
      dropped, the icon color comes from `colorTokens` through the shared
      button, and the hover background is guarded by `@media (hover: hover)`.
