# Branch TODO

- Branch: `feat/spirit-react-align`
- Goal: Align the frontend with the existing reliability architecture and gradually establish frontend engineering practices.

## Current

- [ ] Frontend contract alignment with backend boundary errors and contracts: explore, then implement the agreed alignment; keep working on the migrated Rsbuild frontend and reassess it if normal development exposes regressions.

## Planned

- [ ] Complete full Provider command/event regression coverage (connect/reset/update, startup and lifecycle errors) with the migrated frontend; current mocked browser and real WebView smoke checks do not prove those contracts.
- [ ] Write `docs/rules/frontend-code-style.md` mirroring `rust-code-style.md`: bilingual one-liner JSDoc on exported symbols (English sentence, blank line, Chinese sentence), details only for project-specific counter-intuitive facts, `//` for inline why-comments, path headers on TS/TSX, config files covered by the sweep, HTML/JSON out of scope; keep the HTML favicon/title absent until a brand icon lands at release packaging.
- [ ] Build the TS comments checker under `dev/scripts/ts/comments/` (comment-parser based, wired into `dev/scripts/ts/test.mjs`): report mode on the existing 52 Chinese-only docs first, mandatory with the conventions sweep.
- [ ] Evaluate Rstest when frontend behavior tests arrive; keep Rslib/Rspress/Rsdoctor/Rslint deferred until a concrete need exists.

## Completed

- [x] Establish the branch direction; leave implementation details for later discussion.
- [x] Assess Rstack and commit the evaluation plan as `41298029` (`📝 docs: plan frontend build tool evaluation`); pre-commit repository checks passed.
- [x] Compare Vite 8 and Rsbuild with aligned dependencies and browser targets: Rsbuild improved startup and slightly reduced build time/JS size; HMR results varied by scenario. Retain Rsbuild for continued development; small-project measurements do not establish future scaling advantages.
- [x] Replace Vite with Rsbuild and React/Tailwind plugins; migrate scripts, HTML entry, client types, config type checking, and lint preset. Preserve `@/*`, strict port handling, `apps/ui/dist`, and Tauri CSP; the dev port stayed 5173 at migration time and `f075d028` later adopted the Rsbuild default 3000. Remove obsolete Vite dependencies/configuration and esbuild permission; update cache cleanup.
- [x] Fix the Provider constant barrel cycle exposed by Rsbuild development loading: import card states directly from the leaf module. Recheck both candidates with identical fixed source.
- [x] Pass TypeScript, frontend lint, production build, Chrome production asset/CSP smoke checks, and macOS debug `.app` packaging. Inspect the packaged real WebView homepage, Settings, and expanded Provider form. Verify an occupied dev port fails instead of selecting another port (checked on 5173 before the later move to 3000).
- [x] Start `pnpm dev` with Rsbuild; Rust/Tauri and Go sidecar start and gRPC ping succeeds. Stop the test development process after verification; full native development UI/HMR coverage remains outside this smoke check.
- [x] Re-run the final repository quality gate after aligning Tailwind to 4.3.3: `pnpm test` passed all three stack checks (Go, Rust, TS); `git diff --check` passed.
- [x] Remove the unused `preview` script from `apps/ui`: no references anywhere, and it serves dist without Tauri CSP/IPC so it cannot faithfully preview the packaged app; re-add only when a caller exists (`rsbuild preview` stays available via `pnpm -F @virganol/ui exec`).
- [x] Extract the 13 compiler options shared by both TS projects (bundler mode + strictness) into `apps/ui/tsconfig.base.json`; `tsconfig.app.json` and `tsconfig.node.json` now extend it and keep only environment-specific options (DOM/node types, target, jsx, paths). Verified with `tsc -b` and a production build through the Rsbuild `tsconfigPath` chain.
- [x] Annotate `rsbuild.config.ts` with a path header and a bilingual one-liner JSDoc on the default export; it serves as the comment-convention exemplar (a detailed variant was trimmed: generic tool behavior does not belong in details).
- [x] Establish the initial frontend source style example in `src/main.tsx` and `src/App.tsx`: path headers, grouped imports, CSS side-effect ordering, concise bilingual JSDoc, and direct default component export; enable scoped `import/order` checking for `src/*.{ts,tsx}`.
- [x] Align `src/layouts/MainLayout.tsx` with the initial frontend style example; retain business-context comments until the frontend and backend domain boundaries are understood well enough to simplify them safely.
- [x] Use `src/store/index.ts` as the public Store import boundary, migrate existing Store consumers to `@/store`, extend import ordering to Store sources, and enforce sorted re-exports for Store/layout barrel `index.ts` files.
