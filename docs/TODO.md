# Branch TODO

- Branch: `feat/spirit-rust-quality-audit`
- Goal: Manually audit backend Rust source comments and visibility, then resolve identified issues.

## Current

- [ ] Audit comments and visibility in the remaining `apps/desktop/src-tauri/src/core/bot/models/provider` modules and `core/bot/services`.

## Planned

- [ ] Audit the Rust Comments `core`, `cli`, and `node` crates.
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
