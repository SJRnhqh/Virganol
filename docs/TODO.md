# Branch TODO

- Branch: `feat/spirit-node-canvas-cleanup`
- Parent: `feat/spirit`
- Goal: Remove the unused node canvas and orphaned dependencies, then complete
  compatible toolchain upgrades.

## Current

- [ ] Upgrade TypeScript to a supported v6 release and review remaining updates.

## Planned

## Completed

- [x] Remove the orphaned `@xyflow/react`, `@xterm/xterm`,
      `@xterm/addon-fit`, and `@xterm/addon-web-links` dependencies. Cumulative
      diff budget: 45.7%; `pnpm test` passes.

- [x] Remove the orphaned `BaseCanvas`, `BaseTerminal`, and `canvas.css` import.
      `BaseExpandableMenu` remains in use by Provider settings. `pnpm test`
      passes.

- [x] Remove all sources under `features/node`; the unused dashboard, canvas,
      terminal, SSH, stores, and types are gone. Keep the empty node directory
      locally. No navigation or backend entry referenced this feature.
