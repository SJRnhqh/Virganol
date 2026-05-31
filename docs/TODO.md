# TODO

## Scope

- Branch: `feat/spirit-lifecycle-error-closeout`
- Goal: close out backend lifecycle error propagation review for provider health checks.
- Non-goals: frontend error system changes, broader provider error contract upgrades, and logging system design.

## Current

- [ ] Discuss remaining lifecycle error up-propagation boundaries.

## Next

- [ ] Confirm lifecycle error propagation notes stay aligned with `docs/ROADMAP.md`.

## Validation

- [x] Run `cargo check` from the repository root after lifecycle Rust changes.
- [ ] Confirm lifecycle error propagation notes stay aligned with `docs/ROADMAP.md`.

## Completed

- [x] Reuse `ProviderRecord` enabled-model reconciliation in connect and lifecycle paths.
- [x] Remove the provider enabled-model helper after moving reconciliation into `ProviderRecord`.
- [x] Rename lifecycle result processing from `processor.rs` to `finalize.rs`.
- [x] Rename lifecycle finalization error state to `reconciliation_error`.
- [x] Pass `ProviderRecord` ownership through lifecycle reconciliation persistence.
- [x] Audit `reconcile_enabled_models` behavior and naming.
- [x] Extract pruned enabled-model reconciliation into `ProviderRecord`.
- [x] Rename lifecycle reconciliation persistence and status record fields.
- [x] Model single-provider check post-processing with `ProviderCheckFinalization`.
- [x] Rename `process_provider_check_result` to `finalize_provider_check_result`.
- [x] Keep Step 4 `runner.rs` `Some(Ok(...))` branch wired through finalization.
- [x] Audit `emit_provider_status` event emission failure handling.
- [x] Align `ProviderStatusPayload` run ID borrowing with other lifecycle payloads.
- [x] Rename status payload to `ProviderCheckStatusPayload`.
- [x] Rename status event emitter to `emit_check_status`.
- [x] Normalize lifecycle payload, event, and runner concurrency comments.
- [x] Close out Step 4 `runner.rs` result handling review.
- [x] Review Step 5 structural failure promotion into lifecycle failed events.
- [x] Remove over-explaining Step 5 flow comments after review.
- [x] Review Step 6 lifecycle completed event emission and fallback failure path.
- [x] Remove over-explaining Step 6 flow comments after review.
- [x] Align lifecycle failed fallback log text with the failed event name.
- [x] Close out lifecycle backend flow review.
