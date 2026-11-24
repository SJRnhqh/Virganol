# Branch TODO

- Branch: `feat/spirit-pnpm-deps-follow-up`
- Parent: `feat/spirit`
- Goal: Complete remaining pnpm dependency updates and reduce CI time.

## Current

- [ ] Update the remaining compatible dependencies in small verified batches.

## Planned

## Completed

- [x] Split CI into parallel Go, Rust, and UI jobs. Go and UI run on Ubuntu;
      Rust retains Go for its sidecar build. Remote CI validation pending.
