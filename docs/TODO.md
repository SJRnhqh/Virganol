# Branch TODO

- Branch: `feat/spirit-ui-windowheader`
- Parent: `feat/spirit`
- Goal: Finish the WindowHeader part sequence under `ROADMAP.md` 6.5; each
  part gets the same pass (JSX structure → data/behavior → styles slice).

## Current

- [ ] Walk the remaining `windowHeaderStyles.root` fields, starting from
      `backgroundColor`.

## Planned

- [ ] Resolve the `controlsWindows` margin coupling with `WindowsWindowControls`
      (absolute trailing or a shared width contract); 7.25rem is a stopgap
      matching 0.75rem padding to the 128px Windows controls.
- [ ] Decide the parked `ModuleMenu` (commented out in `Breadcrumb`): wire or
      remove.
- [ ] Narrow store subscriptions in `SidebarToggle` and `SideSwitch` with
      selectors / `useShallow`.

## Completed

- [x] Restored the Windows header controls clearance (`controlsWindows`
      6.5rem → 7.25rem) after the 0.75rem padding change left a 12px
      overlap; parked the macOS fullscreen check in `ROADMAP.md` 6.5.
- [x] Aligned the header with the native macOS title bar: 32px on macOS 26+
      and 28px before (`isTahoeOrNewer`, same split as VS Code), content
      centered, the invisible bottom border dropped, and the minimum system
      version pinned to macOS 11 (the 32px split needs a macOS 26 SDK build); split `lib/platform` into `host` / `mac` /
      `windows` files.
- [x] Moved the traffic-light inset into WindowHeader's StyleX styles and
      removed the animated `MacTrafficLightSpacer`.
- [x] Sorted JSX props alphabetically in 20 shared UI components. ESLint
      enforcement is a separate tooling change.
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
