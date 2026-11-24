# Branch TODO

- Branch: `feat/spirit-ui-header-controls`
- Parent: `feat/spirit`
- Goal: Refine `SideSwitchButton`, `SidebarToggleButton`, and
  `SettingsButton` in the `WindowHeader` actions group. Simplify their state
  subscriptions, event handling, and styles. Preserve their existing behavior
  except for the deliberate changes recorded under Completed.

## Current

- [ ] Review the remaining `MainLayout` store/hooks boundaries and the
      `WindowHeader` window-state hook as needed.

## Planned

## Completed

- [x] Review `SettingsButton`: remove `useSmartSettings` and deliberately open
      the default General tab directly through `useSettingsStore.open` instead
      of deriving a settings tab from navigation. `SettingsNavigation` keeps
      `setTab` for explicit tab switching.
- [x] Derive `SettingsTab` from `"general" | NavId`, removing the navigation ID
      casts. Move `DEFAULT_SETTINGS_TAB` from types to constants so the types
      module stays type-only. Clarify the `setTab` contract and add the settings
      store and state types to both refinement allowlists. TypeScript, ESLint,
      and oxfmt checks pass.

- [x] Review `SidebarToggleButton`: it shares the sidebar store already reviewed
      for `SideSwitchButton`, and additionally selects `isOpen` and `side` for
      its closed and mirrored styles. No further store/types changes needed.
- [x] Review the store/types path behind `SideSwitchButton`: the sidebar store,
      disclosure factory, state contracts, and public type entry. Unify the
      Chinese sidebar wording, export `DisclosureState`, and add the factory's
      explicit return type. Add these files to both refinement allowlists;
      TypeScript, ESLint, and oxfmt checks pass.

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
- [x] Add `bg` as the first `colorTokens` entry, backed by
      `bosquet.light.dominant`, and move the `mainLayoutStyles.root`
      background off `var(--main-bg)`.
- [x] Trim `root`: drop the redundant `width`, and deliberately drop
      `overflow: hidden` so shell overflow surfaces instead of being clipped.
- [x] Trim `workspace`: drop the inert `height`, `width`, and `position`.
      `flex: 1` sets the height and no descendant is anchored to it.
- [x] Deliberately drop `overflow: hidden` on `workspace` until real content
      lands. If tall content makes the page scroll, restore it or add
      `min-height: 0`.
- [x] Rename `workspaceRight` to `workspaceMirrored`, matching
      `sidebarToggleButtonStyles.mirrored`, and remove the three `// TBD`
      markers from `mainLayoutStyles`.
- [x] Migrate `SettingsButton` to the header control pattern:
      `headerSharedStyles.button` and `buttonBg`, the registered
      `settingsButtonIcon`, and `handleOpenSettings` bound directly to
      `onClick`.
- [x] Drop the `SettingsButton` `onClick` prop override and its `handleClick`
      wrapper: no callers pass it, and the override silently bypassed
      context-aware settings navigation. `useSmartSettings` stays intact.
      The button no longer stops mouse-down or double-click propagation;
      clicking or double-clicking the controls does not start dragging or
      toggle window maximization.
- [x] Deliberately change the settings button feedback: the 22px icon, hover
      rotation, active scale, transitions, and Tailwind classes are dropped.
      The icon is 16px and uses `colorTokens` through the shared button.
- [x] Remove the breadcrumb and `ModuleMenu` from the header: delete
      `Breadcrumb.tsx`, `ModuleMenu.tsx`, the `breadcrumbWrap` style, and the
      breadcrumb-only theme tokens (`--header-milestone`,
      `--header-breadcrumb-bg`, `--header-breadcrumb-icon-accent`) from
      `tokens.css` and `light.css`. The active module stays visible in the
      sidebar and `MainStage`.
- [x] Widen the ESLint `refinedFiles` entry and the oxfmt allowlist from
      individual header files to `src/components/header/**`, which covers
      `SettingsButton.tsx`.
- [x] Drop `zIndex: 9999` from `windowHeaderStyles.root`; `isolation:
      "isolate"` is now its only stacking rule. Consequence: the header no
      longer floats above the settings overlay (`z-100`) or the sidebar
      (`z-40`). While the settings modal is open, its transparent backdrop
      covers the header, so the header buttons do not respond and clicking
      the header closes the modal. Accepted for now, to revisit when the
      settings modal is refined.
- [x] Drop `alignItems: "center"` from `windowHeaderStyles.controls`. Every
      child is a full-height `headerSharedStyles.button`, so cross-axis
      alignment has nothing to align.
- [x] Rename `windowHeaderStyles.controls` to `actions` and drop its `// TBD`
      marker. The name now separates the app buttons from `WindowControls`,
      and the group's shape is settled.
- [x] Keep `actions` inside `windowHeaderStyles`: the namespace reads as
      `root`, its conditional fixes, then coexisting child elements. Split
      the group into a component only when a third group arrives.
- [x] First small dependency batch: update the ESLint family within semver
      ranges (eslint, @eslint/js, typescript-eslint, and four plugins).
      `pnpm test` passes; `pnpm diff:budget` worktree at 91.6%. Remaining
      dependency updates tracked in `ROADMAP.md`.
