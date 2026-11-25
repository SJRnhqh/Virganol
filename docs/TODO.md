# Branch TODO

- Branch: `feat/spirit-node-canvas-cleanup`
- Parent: `feat/spirit`
- Goal: Remove the unused node canvas and orphaned dependencies, then complete
  compatible toolchain upgrades.

## Current

- [ ] Remove the unused canvas and terminal components and orphaned dependencies.
- [ ] Upgrade TypeScript to a supported v6 release and review remaining updates.

## Planned

## Completed

- [x] Remove all sources under `features/node`; the unused dashboard, canvas,
      terminal, SSH, stores, and types are gone. Keep the empty node directory
      locally. No navigation or backend entry referenced this feature.
