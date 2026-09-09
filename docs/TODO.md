# Branch TODO

- Branch: `feat/spirit-react-align`
- Goal: Align the frontend with the existing reliability architecture and gradually establish frontend engineering practices.

## Current

- [ ] Continue using the migrated Rsbuild frontend during contract-alignment work; reassess if normal development exposes regressions.
- [ ] Explore frontend alignment with backend boundary errors and contracts.

## Planned

- [ ] Complete full Provider command/event regression coverage (connect/reset/update, startup and lifecycle errors) with the migrated frontend; current mocked browser and real WebView smoke checks do not prove those contracts.
- [ ] Before release, define supported OS/WebView versions and validate Windows/Linux, older supported WebViews, and signed release packaging. Current native packaging check is macOS arm64 debug only.
- [ ] If build performance becomes a bottleneck, extend the comparison to representative larger workloads; do not extrapolate the three-run cold-start results.
- [ ] Evaluate Rstest separately when adding frontend behavior tests; defer Rslib, Rspress, Rsdoctor, and Rslint until a concrete need exists.
- [ ] Implement the agreed frontend contract alignment.
- [ ] Develop frontend coding conventions and testing practices through the changes.

## Completed

- [x] Establish the branch direction; leave implementation details for later discussion.
- [x] Remove the unused `preview` script from `apps/ui`: no references anywhere, and it serves dist without Tauri CSP/IPC so it cannot faithfully preview the packaged app; re-add only when a caller exists (`rsbuild preview` stays available via `pnpm -F @virganol/ui exec`). Keep the bare HTML favicon/title absent: invisible in the packaged app, revisit only when a brand icon lands at release packaging.
- [x] Extract the 13 compiler options shared by both TS projects (bundler mode + strictness) into `apps/ui/tsconfig.base.json`; `tsconfig.app.json` and `tsconfig.node.json` now extend it and keep only environment-specific options (DOM/node types, target, jsx, paths). Verified with `tsc -b` and a production build through the Rsbuild `tsconfigPath` chain.
- [x] Assess Rstack and commit the evaluation plan as `41298029` (`📝 docs: plan frontend build tool evaluation`); pre-commit repository checks passed.
- [x] Compare Vite 8 and Rsbuild with aligned dependencies and browser targets: Rsbuild improved startup and slightly reduced build time/JS size; HMR results varied by scenario. Retain Rsbuild for continued development; small-project measurements do not establish future scaling advantages.
- [x] Replace Vite with Rsbuild and React/Tailwind plugins; migrate scripts, HTML entry, client types, config type checking, and lint preset. Preserve `@/*`, port 5173, strict port handling, `apps/ui/dist`, and Tauri CSP. Remove obsolete Vite dependencies/configuration and esbuild permission; update cache cleanup.
- [x] Fix the Provider constant barrel cycle exposed by Rsbuild development loading: import card states directly from the leaf module. Recheck both candidates with identical fixed source.
- [x] Pass TypeScript, frontend lint, production build, Chrome production asset/CSP smoke checks, and macOS debug `.app` packaging. Inspect the packaged real WebView homepage, Settings, and expanded Provider form. Verify occupied port 5173 fails instead of selecting another port.
- [x] Start `pnpm dev` with Rsbuild; Rust/Tauri and Go sidecar start and gRPC ping succeeds. Stop the test development process after verification; full native development UI/HMR coverage remains outside this smoke check.
- [x] Re-run the final repository quality gate after aligning Tailwind to 4.3.3: `pnpm test` passed all three stack checks (Go, Rust, TS); `git diff --check` passed.
