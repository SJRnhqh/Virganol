# Branch TODO

- Branch: `feat/spirit-pnpm-deps-follow-up`
- Parent: `feat/spirit`
- Goal: Complete remaining pnpm dependency updates and reduce CI time.

## Current

## Planned

## Completed

- [x] Complete the remaining compatible React, React types, framer-motion, and
      xyflow updates. Cumulative diff budget: 74.6%; `pnpm test` passes.

- [x] Split CI into parallel Go, Rust, and UI jobs. Go and UI run on Ubuntu;
      Rust retains Go for its sidecar build. Remote CI validation pending.
