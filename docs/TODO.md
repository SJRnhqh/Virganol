# Branch TODO

- Branch: `feat/spirit-pnpm-deps-update`
- Parent: `feat/spirit`
- Goal: Update pnpm dependencies in verified batches.

## Current

- [ ] Update the remaining compatible dependencies in smaller batches and verify
      each batch.

## Planned

## Completed

- [x] Cache Rust builds in CI with `Swatinem/rust-cache`; pnpm and Go caching
      were already configured. Remote CI validation pending.

- [x] Fourth compatible root tooling batch: commitlint and NAPI CLI. Cumulative
      diff budget: 83.3% (warning); `pnpm test` passes.

- [x] Third compatible batch: Tauri API, CLI, opener, and OS plugins. Cumulative
      diff budget: 33.2%; `pnpm test` passes.

- [x] Second compatible tooling batch: stylelint, stylelint-config-recess-order,
      stylelint-order, tailwindcss, and typescript-eslint. Cumulative diff
      budget: 25.8%; `pnpm test` passes.

- [x] First compatible runtime batch: immer, lucide-react, react-icons,
      tailwind-merge, and zustand. Diff budget: 5.6%.
