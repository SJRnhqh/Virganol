# Branch TODO

- Branch: `feat/spirit-agent-eino-design`
- Goal: Explore and define the Agent Harness and runtime architecture for the Go sidecar.
- Scope: Limit changes to `apps/server`; do not modify `apps/ui` or `apps/desktop`.

## Current

- [ ] Define the Agent Harness goals, boundaries, and initial runtime scenario.

## Planned

- [ ] Define responsibilities across the Harness, runtime, tool execution, and lifecycle.
- [ ] Compare Eino integration approaches and their boundary with the existing gRPC sidecar.
- [ ] Define concurrency, cancellation, error propagation, observability, and testing strategies.
- [ ] Produce a minimal architecture design and split the follow-up implementation work.

## Completed

- [x] Define this as an exploratory development branch scoped to `apps/server`.
