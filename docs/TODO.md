# Branch TODO

- Branch: `feat/spirit-ui-windowheader`
- Parent: `feat/spirit`
- Goal: Finish the WindowHeader part sequence under `ROADMAP.md` 6.5; each
  part gets the same pass (JSX structure → data/behavior → styles slice).

## Current

- [ ] Traffic-light inset pass: drop `MacTrafficLightSpacer` in favor of an
      animated inline start padding on the header, driven by the
      `TRAFFIC_LIGHT_PADDING` / `HEADER_GUTTER` constants.

## Planned

- [ ] Decide the parked `Breadcrumb` and `ModuleMenu` scaffolding: wire,
  restyle, or remove.
- [ ] Narrow store subscriptions in `SidebarToggle` and `SideSwitch` with
  selectors / `useShallow`.
- [ ] Resolve the `mr-26` coupling between the header controls and
  `WindowsWindowControls` (absolute trailing or a shared width contract).

## Completed

- [x] Lock the document root font size at 16px, dropping the viewport-driven
      `clamp()`: desktop convention is a fixed base (VS Code 13px, Zed 16px)
      with OS DPI handling screen differences; zoom stays canvas-only.
- [x] Persist the main window state with `tauri-plugin-window-state` 2.5.0
      (monitor, size, maximized, fullscreen); the window starts hidden and
      the plugin shows it after restoring. Bumped `tauri` to 2.12.5 and
      `@tauri-apps/api` / `@tauri-apps/cli` to 2.12.4 to satisfy the plugin.
- [x] Bound the main window with a 480×600 minimum size in `tauri.conf.json`;
      it still opens maximized and restores to the default size, so the
      viewport-driven root font size can be checked across widths.
- [x] Source the host platform from `@tauri-apps/plugin-os` `type()` in
      `lib/platform.ts`, replacing user-agent sniffing; outside Tauri it
      resolves to `unknown` so no native-control inset is reserved.
- [x] Wire Rsdoctor build analysis: `@rsdoctor/rspack-plugin` dev dependency,
      opt-in `build:doctor` scripts (ui + root delegate), zero config change,
      gated by `RSDOCTOR` env; note scripts are POSIX-shell only for now.
