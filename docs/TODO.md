# TODO

## Scope

- Branch: `feat/spirit-lifecycle-error-closeout`
- Goal: close out backend lifecycle error propagation review for provider health checks.
- Non-goals: frontend error system changes, broader provider error contract upgrades, and logging system design.

## Current

- [ ] Tighten provider store visibility after connection boundaries are closed.

## Next

- [ ] Tighten provider manager visibility after store boundaries are closed.
- [ ] Tighten provider lifecycle visibility after manager boundaries are closed.
- [ ] Leave provider error models for the later generic error contract upgrade.
- [ ] Record lifecycle error up-propagation points while reviewing provider services.
- [ ] Confirm lifecycle error propagation notes stay aligned with `docs/ROADMAP.md`.

## Validation

- [x] Run `cargo check` from the repository root after lifecycle Rust changes.
- [x] Run `cargo check` after core module facade cleanup.
- [x] Run `cargo check` after encapsulating provider store lock access.
- [x] Run `cargo check` after refining provider common models.
- [x] Run `cargo check` after tightening provider config snapshot visibility.
- [x] Run `cargo check` after moving provider state unwrapping into core.
- [x] Run `cargo check` after tightening provider constants and interfaces visibility.
- [x] Run `cargo check` after encapsulating update-enabled-models request data.
- [x] Run `cargo check` after tightening connect request/response contract visibility.
- [x] Run `cargo check` after wrapping manager requests in concrete newtypes.
- [x] Run `cargo check` after wrapping manager responses in concrete newtypes.
- [x] Run `cargo check` after tightening provider check trigger tag visibility.
- [x] Run `cargo check` after encapsulating health check result fields.
- [x] Review prompt and pipeline documentation diff after checkpoint workflow setup.
- [x] Run `cargo check` after tightening `ProviderId` visibility.
- [x] Run `cargo check` after tightening provider secret model visibility.
- [x] Run `cargo check` after tightening `ProviderRecord` visibility.
- [x] Run `cargo check` after tightening provider lifecycle model visibility.
- [x] Run `cargo check` after tightening provider connection visibility.
- [ ] Confirm lifecycle error propagation notes stay aligned with `docs/ROADMAP.md`.

## Completed

- [x] Restrict provider constants visibility to the `core::bot` domain.
- [x] Restrict provider driver interfaces visibility to the `core::bot` domain.
- [x] Encapsulate update-enabled-models request data behind a bot-only accessor.
- [x] Encapsulate connect request data behind bot-only normalized accessors.
- [x] Restrict connect response data fields and success constructor visibility.
- [x] Hide the provider command request envelope behind concrete manager request newtypes.
- [x] Hide the provider command response envelope behind concrete manager response newtypes.
- [x] Restrict connect and update request data visibility to the bot domain.
- [x] Close out provider contract base and manager visibility review.
- [x] Restrict provider check trigger tag helper visibility to the bot domain.
- [x] Restrict health check result visibility and encapsulate result fields.
- [x] Add reusable TODO update, PR info, and working branch closeout prompts.
- [x] Add commit checkpoint and working branch closeout pipelines.
- [x] Make `AppState` provider state private behind a core-only accessor.
- [x] Move provider state unwrapping from commands into core provider services.
- [x] Restrict `ProviderState` and store-lock access to their actual core/bot domains.
- [x] Encapsulate `ProviderCheckSnapshot` fields behind semantic methods.
- [x] Restrict `ProviderCheckSnapshot` visibility to the `core::bot` domain.
- [x] Move `ProviderId` into provider common models.
- [x] Make `ProviderId` serde names explicit and rename DeepSeek internals.
- [x] Normalize `ProviderId` documentation comments.
- [x] Restrict `ProviderId` and its accessors to the `core::bot` domain.
- [x] Restrict provider secret models and accessors to the `core::bot` domain.
- [x] Restrict `ProviderRecord` fields and accessors to the `core::bot` domain.
- [x] Restrict provider lifecycle payload, finalization, and run result models to the `core::bot` domain.
- [x] Scope settings store helpers to the settings domain.
- [x] Scope provider connection health-check entrypoints to the provider domain.
- [x] Encapsulate `ProviderState` store lock behind `lock_store`.
- [x] Move `core::init` implementation from `core/mod.rs` into `core/init.rs`.
- [x] Keep `core/mod.rs` focused on module declarations and facade re-exports.
- [x] Hide `manager` and `rpc` behind the `core` facade while preserving `lib.rs` usage.
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
