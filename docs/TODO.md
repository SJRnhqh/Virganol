# Branch TODO

- Branch: `feat/spirit-error-and-log`
- Goal: Finish the remaining backend development work for error refinement and
  project logging management after the GitHub/prompt workflow automation work
  has been completed.

## Current

- [ ] Connect manager: review and upgrade health-check failure boundary error
  (deferred pending unified error contract for health check results).

## Planned

- [ ] Keep `ProviderErrorDetails` as a placeholder for now and exclude
  structured details from the current provider error design pass.
- [ ] Treat `ProviderErrorKind` as legacy lifecycle/event-channel classification
  during this pass and avoid using it as the center of the new boundary error
  model; optionally detach `ProviderError::kind()` in favor of
  `ProviderErrorKind::from(&error)` before the 6.1 unified contract upgrade.
- [ ] Replace the remaining connect health-check string failure with a
  `ProviderAppError` once the connection failure code/message contract is
  agreed.
- [ ] Revisit `reset_provider_config` double-failure `ProviderAppError::with_message`
  when `ProviderErrorDetails` is implemented: consider embedding multiple
  `ProviderError` sources instead of flattening to a single message string.
- [ ] Keep lifecycle/event-channel error upgrades for the next working branch
  after the current interactive command errors are resolved.
- [ ] Upgrade `ProviderError` after the architecture is agreed: move from the
  current coarse unified model toward a typed, traceable, serializable provider
  error model.
- [ ] Define the project-level logging management model: clarify log ownership,
  levels, structure, persistence, rotation, context fields, and frontend/backend
  responsibilities before implementation.
- [ ] Implement logging changes only after the logging model is settled.

## Completed

- [x] Created the branch-level TODO around the three agreed workstreams: backend
  error management, logging management, and GitHub/prompt workflow scripting.
- [x] Simplified the branch TODO shape to branch, goal, current, planned, and
  completed sections.
- [x] Started prompt workflow cleanup by removing the unused design session
  prompt, renaming the session initializer, adding a prompt template, and
  aligning `AGENTS.md` wording with the prompt playbook model.
- [x] Moved prompt and pipeline assets under `dev/`, with shared workflow
  templates managed by `dev/templates/`.
- [x] Moved root development scripts under `dev/scripts/` and updated package
  commands to use the new paths.
- [x] Refreshed README structure and development overview to reflect `dev/`
  workflow assets and current toolchain badges.
- [x] Locked the Rust toolchain to `1.96.0` and verified it with `cargo check`
  and `pnpm lint:rust:source-headers`.
- [x] Upgraded the pinned pnpm toolchain version to `11.4.0` and verified the
  package workflow after lockfile migration.
- [x] Added the pipeline template for scenario-based workflow orchestration
  under `dev/templates/`.
- [x] Added the session bootstrap pipeline to invoke `dev/prompts/init.md` for
  session startup or context realignment.
- [x] Normalized commit preparation by templating the TODO update and commit
  message prompts and renaming the checkpoint pipeline to `commit-prep`.
- [x] Added the commit pipeline and git commit prompt for explicit commit
  workflows after a commit message has been prepared.
- [x] Aligned the CI pnpm setup action with the pinned `pnpm@11.4.0`
  toolchain after the dependency install check failed in GitHub Actions.
- [x] Migrated the pnpm build-script approval config to the pnpm 11
  `allowBuilds` format so CI can approve `esbuild` during dependency install.
- [x] Added the closeout preparation pipeline by composing `todo-closeout` with
  the shared commit message prompt.
- [x] Normalized PR preparation by templating the PR information prompt and
  adding the `pr-prep` pipeline.
- [x] Added the push pipeline and git push prompt for publishing current branch
  commits without opening a PR.
- [x] Added the PR pipeline by composing current-branch push with the GitHub PR
  creation prompt.
- [x] Removed the obsolete working branch closeout prompt and pipeline after
  replacing them with granular closeout, push, PR preparation, and PR flows.
- [x] Completed the GitHub/prompt workflow automation track by moving workflow
  assets under `dev/`, adding reusable pipeline and prompt templates, and
  documenting the orchestration model in `AGENTS.md`.
- [x] Established the initial provider boundary error skeleton by adding the
  shared `AppError<C, D>` envelope, provider-specific `ProviderAppError`,
  `ProviderErrorCode`, and `ProviderErrorDetails` placeholders, and renaming the
  old variant-aligned `ProviderErrorCode` to `ProviderErrorKind`.
- [x] Promoted the interactive provider command response error slot from
  `Option<String>` to `Option<ProviderAppError>` and aligned the connect, reset,
  and update response failure constructors with the typed boundary error.
- [x] Converted `ProviderAppError` from a type alias into a transparent
  provider-domain newtype over `AppError<ProviderErrorCode, ProviderErrorDetails>`.
- [x] Added the first provider boundary error code,
  `missing_request_data`, with its safe fallback message managed alongside the
  code and exposed through `ProviderAppError::missing_request_data`.
- [x] Replaced the interactive manager missing-data failure sites in `connect`
  and `update_models` with `ProviderAppError::missing_request_data`.
- [x] Renamed the internal provider error file from `base.rs` to `internal.rs`
  and tightened `ProviderError` visibility to the `core::bot` boundary.
- [x] Added the `ProviderError::into_app_error` conversion hook as the explicit
  internal-error to app-boundary error transition point, with concrete mapping
  left for the next implementation pass.
- [x] Migrated single-`ProviderError` interactive manager failure sites in
  `update_models`, `connect`, and `reset` to call `into_app_error` instead of
  passing raw error messages into responses.
- [x] Relocated internal-to-app boundary translation to the contract side by
  adding `From<ProviderError> for ProviderAppError` in `app.rs` and removing
  `ProviderError::into_app_error`, so domain errors no longer depend on boundary
  types.
- [x] Updated interactive manager failure sites to translate domain errors with
  `ProviderAppError::from(e)` at the boundary layer.
- [x] Added update-chain boundary codes `provider_not_found` and `storage_failed`
  with safe fallback messages managed alongside `ProviderErrorCode`.
- [x] Added `From<&ProviderError> for ProviderErrorCode` as the contract-side
  coarsening hook and wired `app.rs` translation to delegate classification to
  the code layer.
- [x] Classified the update-chain provider config missing case with
  `ProviderError::ConfigNotFound` and mapped it to the `provider_not_found`
  boundary code.
- [x] Split reviewed provider config JSON encode/decode failures into
  `JsonSerialize` and `JsonDeserialize`, mapped both to `storage_failed`, and
  wired update-chain `to_value` / `from_value` call sites to those variants.
- [x] Classified provider config store open failures with
  `ProviderError::ConfigStoreOpen` and mapped them to the `storage_failed`
  boundary code.
- [x] Completed update-chain common store save path classification by adding
  provider error variants for app data dir resolution, JSON byte serialization,
  temporary file creation, file write, file sync, and atomic replacement, all
  coarsened to the `storage_failed` boundary code.
- [x] Normalized provider error conversion comments by moving implementation
  comments onto the concrete conversion functions in `app.rs` and `code.rs`.
- [x] Renamed `StorageFailed` → `ConfigStoreFailed` and added `SecretStoreFailed`
  boundary code, aligned with `store/config` and `store/secret` module boundaries.
- [x] Added `SecretStoreInit` and `SecretStoreWrite` `ProviderError` variants for
  secret store operations, with code.rs coarse mapping to `SecretStoreFailed`.
- [x] Reviewed connect manager `ProviderKeyTransaction::begin` error path:
  `save_provider_key` sites are classified and mapped; load/remove secret
  functions deferred.
- [x] Aligned connect manager `save_provider` JSON serialization error site
  with `ProviderError::JsonSerialize`, matching the update-chain pattern.
- [x] Added `SecretStoreRead` `ProviderError` variant, wired into Display/kind/code.rs
  mapping to `SecretStoreFailed`.
- [x] Introduced `Downgrade` trait under `shared/interfaces/error` with `impl_downgrade!`
  macro; implemented for `ProviderError` and applied to `load_provider_key` warning sites.
- [x] Added `Unknown` boundary error code as catch-all for unclassified `ProviderError`
  variants, replacing the legacy `_ => ConfigStoreFailed` fallback.
- [x] Added `SecretStoreRemove` `ProviderError` variant; upgraded all
  `remove_provider_key` error sites from `Keyring` to `SecretStoreInit` /
  `SecretStoreRemove`.
- [x] Removed legacy `ProviderError::Keyring` and `ProviderErrorKind::Keyring`;
  secret store kind() mappings redirected to `ProviderErrorKind::Io`.
- [x] Unified `ProviderKeyTransaction::Drop` rollback warning with `downgrade()`;
  connect manager secret store error classification complete.
- [x] Aligned `remove_provider` `serde_json::to_value` with `ProviderError::JsonSerialize`,
  matching the update-chain pattern.
- [x] Replaced `remove_provider` "config not found" `log::warn!` with
  `ProviderError::ConfigNotFound.downgrade()`.
- [x] Fixed reset manager double-failure compile error: replaced `format!` with
  `ProviderAppError::with_message(ProviderErrorCode::from(&e), ...)`.
- [x] Added `ProviderAppError::with_message` for custom boundary error messages.
- [x] Added `CheckLifecycleFailed` boundary code to `ProviderErrorCode`
  (lifecycle layer, second position after manager).
- [x] Added `CheckStartedEmit` `ProviderError` variant (first position), mapped
  to `CheckLifecycleFailed`.
- [x] Added `CheckCompletedEmit` `ProviderError` variant (second position),
  mapped to `CheckLifecycleFailed`.
- [x] Moved `UnsupportedProvider` to early position in `ProviderError`
  (third, after lifecycle variants) with doc comment.
- [x] Removed `SkippedProviderDetail` struct; simplified snapshot.skipped to
  `Vec<String>`.
- [x] Added `downgrade()` for unsupported provider in
  `load_provider_check_snapshot`; kept context-rich `warn!` in flow.
- [x] Simplified `ProviderCheckSnapshot`: dropped `skipped()` iteration in
  favor of count-based info log.
- [x] Added `CheckStatusEmit` and `CheckFailedEmit` `ProviderError` variants
  (lifecycle group: started → status → completed → failed), mapped to
  `CheckLifecycleFailed`.
- [x] Replaced `LifecycleConcurrentCheck` with `CheckConcurrentFailed`
  `ProviderError` variant, mapped to `CheckLifecycleFailed`.
- [x] Tightened `ProviderIssue` fields: `code` + `message` → `error:
  ProviderAppError`.
- [x] Removed dead `ProviderError` variants: `Serde`, `Io`, `LifecycleEventEmit`,
  `LifecycleConcurrentCheck` (and stale `From<serde_json::Error>` impl).
- [x] Simplified `Downgrade` trait to reference-only impl; auto-ref covers
  owned values.
- [x] Simplified `failure.rs` fallback: `downgrade()` for emit failure +
  original error, `issues_count` in context log.
- [x] Removed stale `error!` from `finalize.rs` reconcile persist path
  (error propagated via return value).
- [x] Upgraded `ProviderCheckFailedPayload`: `code` + `message` → `error:
  ProviderAppError`.
- [x] Unified all `ProviderAppError::from(e)` call sites to `from(&e)`;
  removed `From<ProviderError>` impl.
- [x] Removed `ProviderErrorKind` enum, `kind()` method, and `kind.rs` (72
  lines) — fully replaced by `ProviderErrorCode`.
