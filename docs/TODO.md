# Branch TODO

- Branch: `feat/spirit-pnpm-deps-update`
- Parent: `feat/spirit`
- Goal: Update pnpm dependencies in verified batches.

## Current

- [ ] Update pnpm dependencies in small batches and verify each batch.

## Planned

- [ ] Improve CI caching for dependencies and Rust builds.

## Completed

- [x] Second compatible tooling batch: stylelint, stylelint-config-recess-order,
      stylelint-order, tailwindcss, and typescript-eslint. Cumulative diff
      budget: 25.8%; `pnpm test` passes.

- [x] First compatible runtime batch: immer, lucide-react, react-icons,
      tailwind-merge, and zustand. Diff budget: 5.6%.
