# Branch TODO

- Branch: `feat/spirit-log-and-trace`
- Goal: Implement the observability system for the reliability architecture.

## Current

- [ ] Record the first Provider manager failure through `AppLogger` on the update-enabled-models path.

## Planned

- [ ] Integrate structured Provider failure records across the remaining manager and lifecycle paths.
- [ ] Define the structured logging sink boundary.
- [ ] Implement the structured logging application integration layer, revisiting attribution ownership at the emission boundary.
- [ ] Implement the structured logging persistence layer, revisiting `ProviderAttribution` clone semantics and cost for durable writes.
- [ ] Implement the execution tracing system.
- [ ] Incorporate the completed observability design into the architecture documentation.

## Completed

- [x] Explore and define the roles of logging and tracing within the observability system.
- [x] Establish the private shared logging skeleton with `AppLogger` and `LogEntry` placeholders.
- [x] Standardize Provider subject reality terminology in Rust documentation comments.
- [x] Align Provider context documentation with subject reality terminology.
- [x] Complete reality terminology alignment for Provider contexts and Settings process models.
- [x] Establish the Provider logging projection skeleton and visibility boundaries.
- [x] Implement Provider business context observation into structured logging context.
- [x] Implement Provider failure log entry observation with lightweight failure kinds.
- [x] Establish shared log observation construction with timestamp and severity.
- [x] Establish explicit Provider log entry generalization into the shared `LogEntry` boundary.
- [x] Preserve domain occurrence facts in the generic shared `LogEntry` boundary.
- [x] Establish structured log text projection and log-facade emission through `AppLogger`.
- [x] Register `AppLogger` as Tauri-managed state and establish the Provider failure recording boundary.
- [x] Move the desktop application run lifecycle into the `container` module.
- [x] Separate desktop container logging, registration, sidecar, and lifecycle responsibilities.
- [x] Consolidate desktop command registration and Windows window appearance under the container boundary.
- [x] Separate Tauri command handler management into a root-scope invoke include without generated macro internals.
