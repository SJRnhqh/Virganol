# Branch TODO

- Branch: `feat/spirit-rust-quality-audit`
- Goal: Manually audit backend Rust source comments and visibility, then resolve identified issues.

## Current

- [ ] Audit the Rust Comments `core`, `cli`, and `node` crates.

## Planned

- [ ] Fix identified comment and visibility issues and run the necessary checks.

## Completed

- [x] Established the Rust Comments quality gate and repository audit baseline.
- [x] Verified that `apps/desktop/src-tauri/src/commands` has compliant comments and minimal visibility.
- [x] Verified that `apps/desktop/src-tauri/src/core/shared` has compliant comments and minimal visibility.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/constants` structure, comments, and visibility.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/process` comments, visibility, and re-exports.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/provider/common` comments and visibility.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/provider/config` and `connection` comments, visibility, and method layout.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/provider/context` comments, member documentation, and visibility; aligned Settings process contexts with the attribution model.
- [x] Verified `apps/desktop/src-tauri/src/core/bot/models/provider/contract/base` comments and the shared request/response wrapper visibility boundary.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/provider/contract/lifecycle` comments and verified its event payload visibility boundaries.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/provider/contract/manager` comments and transparent wrapper documentation; verified command and service visibility boundaries.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models/provider/error`, `lifecycle`, and `secret` comments, member documentation, and visibility boundaries.
- [x] Consolidated Rust Comments quality-gate coverage under `core/shared` and `core/bot`.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/services` comments and member documentation; verified all function and re-export visibility boundaries.
- [x] Normalized `apps/desktop/src-tauri/src/core/bot/models` type and enum-variant imports; verified comments, visibility, and implementation ordering.
- [x] Rechecked `apps/desktop/src-tauri/src/commands` and `core/shared` against stricter import, visibility, and comment conventions.
