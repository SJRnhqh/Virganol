# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Rust/Tauri backend logging and tracing; excludes forwarded Go sidecar output, frontend observability, metrics, remote export, and alerting

## Current

- [ ] Document the Rust/Tauri backend observability contract (facade, events, spans, subscriber, layers, sinks, filtering, field stability, lifecycle boundaries), recording the console-only banner, unified default level, and dropped JSONL run delimiter decisions, and update the matching ROADMAP 6.2 progress to close the phase

## Planned

## Completed

- [x] Marked the relative path, re-export visibility, and type implementation order specifications as Verification TBD, and dropped the token display derivation section from rust-code-style.md pending its final policy shape
- [x] Flattened the retention directory walk through `filter_map(Result::ok)`, replacing the double-flatten form with a single error-skipping step that reads as one intent
- [x] Converged multi-failure recording into `record_failure_with_suppressed`, moving the primary-first suppressed-after ordering into the facade and collapsing both call sites to single-expression forms
- [x] Declared chrono's `clock` feature explicitly for the retention `Utc::now()` cutoff, ending the silent reliance on tracing-subscriber feature unification with zero lock-tree change
- [x] Tightened the Provider log vocabulary visibility to the `log` submodule boundary: `ProviderObservation` and `ProviderOccurrence` enum declarations and their `log` hub re-exports now stop at `pub(super)`/`pub(self)`, matching their module-internal-only consumers
- [x] Dropped the unused `E = ()` default type parameter from the Provider base context, keeping every construction site explicit about its context-extra type
- [x] Extended the comment ASCII whitelist with the UTC term for the retention timezone-anchoring doc comment
- [x] Anchored the JSONL retention expiry on the rolled filename's UTC date through `NaiveDate` comparison instead of file mtime, aligning with the appender's UTC midnight rotation, deleting touch-refreshed stale files, and dropping the metadata stat from the cleanup
- [x] Narrowed the chrono dependency to calendar parsing only by disabling default features, dropping the pulled-in iana-time-zone consumers' wasm companions (js-sys, wasm-bindgen) from the lock tree while keeping NaiveDate parsing behavior unchanged
- [x] Replaced the handwritten rolled-date shape check in the JSONL retention cleanup with chrono's `NaiveDate::parse_from_str`, declaring chrono as an explicit dependency for stricter calendar validity at fewer lines
- [x] Converged the AppLogger severity field table into one function-local `record_at!` macro, keeping the per-level arms as five static event callsites while collapsing the duplicated field lists into a single compile-time definition point
- [x] Resolved the banner RUST_LOG fork by routing the level display through filter-module parsing: banner-level keeps only directives that pass the same per-directive validity check the layers use, echoes the valid remainder verbatim, and falls back to the default level when unset or fully invalid, reducing banner to a pure display consumer of a filter-resolved fact
- [x] Unified the Chinese doc comment punctuation in the logging backend to full-width commas, closing the half-width/full-width split against the core-side baseline
- [x] Guarded the colored field separator write so a failed separator preserves the first error instead of being overwritten by a later successful field write
- [x] Reversed the ProviderSpan preamble dedup deferral by converging the shared attribution triplet into one local `attributed_span!` macro, keeping per-span extras at the call sites and anchoring the attribution type once in the macro body so call sites convert through `into`
- [x] Derived the Provider check trigger token through strum Display alongside serde snake_case, removing the handwritten as_tag match and its dual-source spelling risk
- [x] Codified the relative path discipline, re-export visibility boundaries, and token display derivation policies in rust-code-style.md
- [x] Moved the JSONL persistence verification out of the Rust backend observability gate in ROADMAP 6.2, recording the frontend-aligned deferral decision and the token Display review closeout
- [x] Derived the Provider token Displays through strum across the stage, manager-operation, operation, occurrence, and subject enums, mixing snake_case, transparent, and to_string captures, and removing every handwritten token match arm while keeping Attribution (struct) and ProviderId (single token source) as the closed manual exceptions
- [x] Tightened the banner fallback level rendering to ascii lowercase
- [x] Deferred the ProviderSpan preamble dedup by explicit decision, keeping the explicit per-span field tables as the field-stability contract
- [x] Centralized the default EnvFilter construction in a shared filter helper, keeping per-layer filter instances independently composed
- [x] Centralized manager failure handling in a shared `fail` helper, pairing failure logging with boundary projection at one definition point while keeping the compound suppressed-error arm explicit
- [x] Sunk log severity into a typed observation vocabulary: strum-derived tokens with exhaustive severity on `ProviderObservation`, a `Failure | Observation` bridge occurrence, and a level-blind `ProviderLogEntry`, removing the level argument from every business recorder
- [x] Deduplicated the lifecycle completion tail into one shared helper behind an explicit empty-providers short-circuit, replacing the behavior-equivalent slice match
- [x] Codified the five-tier trait impl order in `rust-code-style.md` as Type Implementation Order (Policy TBD) and realigned `attribution.rs` to the unified convention
- [x] Emitted the console-only startup banner: a double-layer 3D frame with green ANSI Shadow brand art and tiered ❯/· facts for version, log directory, and effective level, validated by a version-matched replica harness with per-row width checks
- [x] Scoped the startup banner to console-only output, replacing the planned stable tracing event and dropping the JSONL run delimiter by explicit decision
- [x] Centralized the default log level as one typed constant shared by the console layer, the JSONL layer, and the banner
- [x] Moved the brand art constant into the logging constants module for single-file maintenance
- [x] Extended the comment ASCII whitelist with the RUST_LOG and ANSI standard terms

- [x] Verified the observability backend through a full review pass, confirming stable layering, naming, and code organization ready for the startup banner
- [x] Merged the run-id generator's split std imports into the nested shared-root import form
- [x] Verified console filtering and readability through a live RUST_LOG downgrade run, accepting duplicated span attribution fields as the compact v1 presentation
- [x] Centralized the rolled JSONL file naming constants shared by the file layer and retention cleanup
- [x] Added first-failure stderr reporting for JSONL writes by wrapping the file appender, keeping later failures silent and errors transparent
- [x] Added startup cleanup of expired daily JSONL log files with a fourteen-day retention window, matching only rolled log naming
- [x] Added non-blocking JSONL file writing with the worker guard owned by managed Tauri state, flushing pending lines on app exit
- [x] Recorded per-span close timing (`time.busy` / `time.idle`) on the JSONL layer through native span close events, keeping console output free of span records
- [x] Emitted stable lifecycle start and completion events to delimit each run in console and JSONL output
- [x] Recorded one stable lifecycle completion event after the completed event is emitted successfully
- [x] Instrumented each Provider lifecycle run with an attributed root span and each concurrent health check with an execution child span, preserving run_id and trigger across task boundaries
- [x] Emitted the enabled-model update success from the surviving manager root with the config-store stage derived as an unconsumed view
- [x] Emitted the connection success from the surviving manager root with scoped connection, config-store, and secret-store stage views
- [x] Emitted the reset success from the surviving manager root with scoped config-store and secret-store stage views
- [x] Recorded successful Provider configuration restoration after a failed reset key deletion
- [x] Recorded successful Provider key rollback after failed connection configuration persistence
- [x] Recorded single Provider reset failures through the singular failure recorder
- [x] Instrumented the Provider connect manager with an attributed async root span, a connection-probe child span, and a successful connection event
- [x] Instrumented the Provider reset manager with an attributed root span and a successful reset event
- [x] Instrumented the Provider enabled-model update manager with an attributed root span and a successful update event
- [x] Established the Provider Span factory with shared attribution fields, lifecycle correlation fields, and stable names for management, lifecycle, and execution business spans
- [x] Simplified Provider scope derivation to use stable stage and operation tokens instead of a duplicated constant matrix
- [x] Established stable native Provider event fields and connected the semantic AppLogger facade directly to tracing
- [x] Assigned timestamps and formatting to subscribers and sinks instead of domain log entries
- [x] Registered tracing-subscriber at the start of Tauri setup with an independently composed, RUST_LOG-filtered console Layer
- [x] Added a daily rolling JSONL Layer in the Tauri application log directory and validated file creation through pnpm dev
- [x] Standardized the desktop application identifier and Provider keyring namespace on com.virganol
- [x] Adopted the compact console format with hidden targets, framework level colors, and local short timestamps via ChronoLocal
- [x] Colored console field keys cyan through a dedicated logging color module, rendering all fields as the v1 field policy
