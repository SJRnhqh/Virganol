# Branch TODO

- Branch: `feat/spirit-ui-header-controls`
- Parent: `feat/spirit`
- Goal: Refine `SideSwitchButton`, `SidebarToggleButton`, and
  `SettingsButton` in the `WindowHeader` controls group. Simplify their state
  subscriptions, event handling, and styles. Preserve their existing behavior
  except for the deliberate changes recorded under Completed.

## Current

- [ ] Review `mainLayoutStyles` field by field: `root`, `workspace`, and
      `workspaceRight` still carry `// TBD`.

## Planned

- [ ] Review the store layer behind the refined buttons: how `SideSwitchButton`
      and `SidebarToggleButton` select sidebar state and actions from
      `useSidebarStore`.
- [ ] Simplify `SettingsButton` props and click handling. Check whether the
      optional `onClick` override has callers and preserve context-aware
      settings navigation.
- [ ] Move `SettingsButton` to StyleX and reuse existing header styles and
      tokens where appropriate. Review group spacing, icon sizing, and the
      hover and focus feedback. Decide the focus styles of
      `headerSharedStyles.button`.
- [ ] Review the remaining mouse-down and double-click interception in
      `SettingsButton` against the `WindowHeader` guards. Verify that clicking
      or double-clicking the controls does not start dragging or toggle window
      maximization.
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
- [x] Replace `var(--header-icon-bg)` with `colorTokens.headerIconHoverBg`.
      Add `vine.danlvhui` and the `undertone` role in `bosquet`, with
      `pine.wasonglv` as the dark placeholder.
- [x] Deliberately drop the transition from `sideSwitchButtonStyles.root`. It
      now only holds the hover background.
- [x] Move the placeholder `white` to the bottom of both palettes, separated
      by a temporary comment.
- [x] Add `SideSwitchButton.tsx` to the ESLint `refinedFiles` list and the
      matching oxfmt allowlist.
- [x] Shorten the `MainLayout` `useShallow` selector: destructure the picked
      fields in the selector parameter instead of mapping each one from
      `state`. Behavior is unchanged.
- [x] Migrate `SidebarToggleButton` to the header control pattern: a
      `useShallow` subscription, `headerSharedStyles.button`, and the
      registered `sidebarToggleButtonIcon`. The button no longer stops
      mouse-down or double-click propagation.
- [x] Deliberately change the sidebar toggle behavior: the hover translate,
      active scale, and transitions are dropped, the icon is 16px, and the
      button height follows the header. The icon color comes from
      `colorTokens` through the shared button.
- [x] Replace the `PanelLeft` / `PanelRight` switch with one `PanelLeft` icon,
      mirrored by `sidebarToggleButtonStyles.mirrored` when the sidebar is on
      the right.
- [x] Deliberately keep the closed-state feedback as
      `sidebarToggleButtonStyles.closed` (`opacity: 0.5`) on the whole button,
      so the hover background dims with the icon.
- [x] Extract the hover background into `headerSharedStyles.buttonBg` and
      remove `sideSwitchButtonStyles`. `SideSwitchButton` and
      `SidebarToggleButton` compose `button` with `buttonBg`.
- [x] Rename the sidebar toggle component, file, icon, and styles to
      `SidebarToggleButton`.
- [x] Add `SidebarToggleButton.tsx` to the ESLint `refinedFiles` list and the
      matching oxfmt allowlist.
