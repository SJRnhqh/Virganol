# Branch TODO

- Branch: feat/spirit-reliability-design
- Goal: Close out Provider reliability architecture and prepare its PR into `feat/spirit`

## Current

- [ ] Branch closeout: remove this TODO and prepare the PR into `feat/spirit`

## Completed

- [x] Provider context propagation: completed manager, lifecycle, execution, stage transition, candidate, concrete Provider, and configured-provider collection attribution
- [x] Provider internal error architecture: separated closed failure facts from runtime context, reduced `ProviderError` to a thin attributed contract, and preserved causal sources and downgrade diagnostics
- [x] Provider boundary architecture: separated command success responses from `ProviderAppError` and exhaustively projected code, safe message, business scope, optional Provider attribution, and suppressed errors
- [x] Rust code policy baseline: normalized command and shared Core item docs and visibility boundaries, then added configurable item-documentation and re-export visibility checks
- [x] Development workflow alignment: tightened pipeline response style and recorded deferred policy-scanner design in the project roadmap
