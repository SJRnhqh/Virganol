# Branch TODO

- Branch: feat/spirit-log-backend
- Goal: Complete the Rust/Tauri Provider observability v1 with native structured events, correlated execution spans, and durable local logs
- Scope: Rust/Tauri backend logging and tracing; excludes forwarded Go sidecar output, frontend observability, metrics, remote export, and alerting

## Current

- [ ] Document the Rust/Tauri backend observability contract (facade, events, spans, subscriber, layers, sinks, filtering, field stability, lifecycle boundaries), recording the console-only banner, unified default level, and dropped JSONL run delimiter decisions, and update the matching ROADMAP 6.2 progress to close the phase

## Planned

## Completed

- [x] Removed the fake `attribution_parts_for` indirection from the Provider base context: the generic container knew nothing about subjects or operations and merely re-paired its callers' own data, so the three business contexts now assemble their attribution triples in place while the base sheds its last attribution imports and narrows to stage plus opaque extra
- [x] Inlined the LogEntry construction by deleting the private synonym `new` and building the entry directly in `from_observation`, leaving the two callers (Provider facade and `impl_downgrade!`) untouched
- [x] Verified branch code quality through a systematic review of the full diff against the parent branch, confirming style-rule compliance (path headers, bilingual docs, explicit imports, tight visibility, impl order) and leaving the remaining findings as documented design decisions
- [x] Collapsed the Provider observation severity table into distributed strum props: only the `SecretRollbackSkipped` exception declares `warn`, every other observation falls back to the `Info` default at the single `get_str` query, erasing the handwritten per-variant match and its seven redundant `info` arms
- [x] Collapsed the Provider log entry into a stateless logging facade mirroring `ProviderSpan`: deleted the transient `new`/`generalize` envelope and its two fields, converged the private entry point into `record_entry` building the shared `LogEntry` directly, and dropped the identity `.into()` after the failure attribution clone
- [x] Tightened the Provider context re-export chain after the envelope removal: `ProviderOperation` and `ProviderStage` hub re-exports lost their last outside consumer and now stop at `pub(self)` inside `context`, merged into one operation re-export line, while their declared widths stay provider-wide to match the `generalize` signature
- [x] Extracted the reset manager's inline secret-removal block into a named `removal_result` binding matched by the if-let, keeping scope, stage derivation, and semantics unchanged while making the match target readable first
- [x] Marked the relative path, re-export visibility, and type implementation order specifications as Verification TBD, and dropped the token display derivation section from rust-code-style.md pending its final policy shape
- [x] Flattened the retention directory walk through `filter_map(Result::ok)`, replacing the double-flatten form with a single error-skipping step that reads as one intent
- [x] Converged multi-failure recording into `record_failure_with_suppressed`, moving the primary-first suppressed-after ordering into the facade and collapsing both call sites to single-expression forms
- [x] Declared chrono's `clock` feature explicitly for the retention `Utc::now()` cutoff, ending the silent reliance on tracing-subscriber feature unification with zero lock-tree change
- [x] Tightened the Provider log vocabulary visibility to the `log` submodule boundary: `ProviderObservation` and `ProviderOccurrence` enum declarations and their `log` hub re-exports now stop at `pub(super)`/`pub(self)`, matching their module-internal-only consumers
- [x] Anchored the JSONL retention expiry on the rolled filename's UTC date through `NaiveDate` comparison instead of file mtime, aligning with the appender's UTC midnight rotation, deleting touch-refreshed stale files, and dropping the metadata stat from the cleanup
- [x] Narrowed the chrono dependency to calendar parsing only by disabling default features, and replaced the handwritten rolled-date shape check with chrono's `NaiveDate::parse_from_str` for stricter calendar validity at fewer lines
- [x] Converged the AppLogger severity field table into one function-local `record_at!` macro, keeping the per-level arms as five static event callsites while collapsing the duplicated field lists into a single compile-time definition point
- [x] Resolved the banner RUST_LOG fork by routing the level display through filter-module parsing: banner-level keeps only directives that pass the same per-directive validity check the layers use, echoes the valid remainder verbatim, and falls back to the default level when unset or fully invalid, reducing banner to a pure display consumer of a filter-resolved fact
- [x] Guarded the colored field separator write so a failed separator preserves the first error instead of being overwritten by a later successful field write
- [x] Reversed the ProviderSpan preamble dedup deferral by converging the shared attribution triplet into one local `attributed_span!` macro, keeping per-span extras at the call sites and anchoring the attribution type once in the macro body so call sites convert through `into`
- [x] Derived the Provider token Displays through strum across the stage, manager-operation, operation, occurrence, check-trigger, and subject enums, mixing snake_case, transparent, and to_string captures, and removing every handwritten token match arm while keeping Attribution (struct) and ProviderId (single token source) as the closed manual exceptions
- [x] Codified the relative path discipline, re-export visibility boundaries, and five-tier type implementation order policies in rust-code-style.md
- [x] Moved the JSONL persistence verification out of the Rust backend observability gate in ROADMAP 6.2, recording the frontend-aligned deferral decision and the token Display review closeout
- [x] Sunk log severity into a typed observation vocabulary: strum-derived tokens with exhaustive severity on `ProviderObservation`, a `Failure | Observation` bridge occurrence, and a level-blind `ProviderLogEntry`, removing the level argument from every business recorder
- [x] Centralized the shared helpers of the observability backend: default EnvFilter construction, manager failure handling (`fail`), multi-failure recording, lifecycle completion tail, default log level constant, and rolled JSONL file naming constants
- [x] Emitted the console-only startup banner: a double-layer 3D frame with green ANSI Shadow brand art and tiered ❯/· facts for version, log directory, and effective level, validated by a version-matched replica harness with per-row width checks, replacing the planned stable tracing event and dropping the JSONL run delimiter by explicit decision
- [x] Completed the review-driven polish pass: unified Chinese doc comment punctuation, tightened banner fallback level to ascii lowercase, extended the comment ASCII whitelist (RUST_LOG, ANSI, UTC), merged the run-id std imports, and deferred the span preamble dedup by explicit decision
- [x] Verified the observability backend through a full review pass, confirming stable layering, naming, and code organization, and verified console filtering and readability through a live RUST_LOG downgrade run
- [x] Added non-blocking JSONL file writing with the worker guard owned by managed Tauri state, first-failure stderr reporting through a wrapped appender, startup cleanup of expired daily files with a fourteen-day retention window, and per-span close timing (`time.busy` / `time.idle`) through native span close events
- [x] Emitted stable lifecycle start and completion events to delimit each run in console and JSONL output, and recorded one stable lifecycle completion event after the completed event is emitted successfully
- [x] Instrumented each Provider lifecycle run with an attributed root span and each concurrent health check with an execution child span, preserving run_id and trigger across task boundaries
- [x] Emitted the interactive success, failure, and compensation events from the surviving manager root with scoped stage views: connection, reset, and enabled-model update successes, configuration restoration after a failed reset key deletion, and key rollback after failed connection persistence
- [x] Instrumented the Provider connect, reset, and enabled-model update managers with attributed root spans and successful operation events
- [x] Established the Provider Span factory with shared attribution fields, lifecycle correlation fields, and stable names for management, lifecycle, and execution business spans, simplifying scope derivation to stable stage and operation tokens instead of a duplicated constant matrix
- [x] Established stable native Provider event fields and connected the semantic AppLogger facade directly to tracing, assigning timestamps and formatting to subscribers and sinks instead of domain log entries
- [x] Registered tracing-subscriber at the start of Tauri setup with an independently composed, RUST_LOG-filtered console Layer and a daily rolling JSONL Layer in the Tauri application log directory, validated through pnpm dev
- [x] Standardized the desktop application identifier and Provider keyring namespace on com.virganol
- [x] Adopted the compact console format with hidden targets, framework level colors, local short timestamps via ChronoLocal, and cyan field keys through a dedicated logging color module
- [x] Dropped the unused `E = ()` default type parameter from the Provider base context, keeping every construction site explicit about its context-extra type
