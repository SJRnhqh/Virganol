# Branch TODO

- Branch: `feat/spirit-node-canvas-cleanup`
- Parent: `feat/spirit`
- Goal: Remove the unused node canvas and orphaned dependencies, then complete
  compatible toolchain upgrades.

## Current

## Planned

## Completed

- [x] Upgrade TypeScript to 6.0.3, supported by typescript-eslint, and remove the
      deprecated `baseUrl`; relative `paths` now resolve from the tsconfig.
      Cumulative diff budget: 91.2%; `pnpm test` passes.

- [x] Update `lucide-react` to 1.79.0. Cumulative diff budget: 74.3%; `pnpm test`
      passes.

- [x] Update `@napi-rs/cli` to 3.11.1. Cumulative diff budget: 71.4%; `pnpm test`
      passes.

- [x] Update `@rsbuild/core` to 2.3.4. Cumulative diff budget: 70.0%; `pnpm test`
      passes.

- [x] Remove the unused SSH prototype, Tauri `tmp` module, and `ssh2` dependency
      after confirming no frontend consumer. Cargo check and `pnpm test` pass.

- [x] Remove the orphaned Tauri PTY terminal implementation, command/state
      registrations, and `portable-pty` dependency. The Go sidecar and Provider
      lifecycle remain in use. Cargo check and `pnpm test` pass.

- [x] Remove the orphaned `@xyflow/react`, `@xterm/xterm`,
      `@xterm/addon-fit`, and `@xterm/addon-web-links` dependencies. Cumulative
      diff budget: 45.7%; `pnpm test` passes.

- [x] Remove the orphaned `BaseCanvas`, `BaseTerminal`, and `canvas.css` import.
      `BaseExpandableMenu` remains in use by Provider settings. `pnpm test`
      passes.

- [x] Remove all sources under `features/node`; the unused dashboard, canvas,
      terminal, SSH, stores, and types are gone. Keep the empty node directory
      locally. No navigation or backend entry referenced this feature.
