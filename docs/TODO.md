# Branch TODO

- Branch: `feat/spirit-ui-cleanup`
- Parent: `feat/spirit`
- Goal: Normalize and clean the frontend shell layer (`apps/ui/src` outside
  `features/`).

## Current

- [ ] Audit and normalize the shell layer: boundaries, dead code, and
  conventions.

## Planned

- [ ] Align `features/` (only if diff budget remains; scope TBD).

## Completed

- [x] Add root UI lint and auto-fix commands; consolidate ESLint shell-layer
  path matching.
- [x] Normalize shell imports through public aliases and organize library barrel
  exports.
