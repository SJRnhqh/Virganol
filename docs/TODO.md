# Branch TODO

- Branch: feat/spirit-reliability-polish
- Goal: Polish Provider reliability architecture — Settings upgrade, policy audit, lint hardening, and architecture documentation

## Current

- [ ] Review and polish Provider error architecture and business scope projection

## Planned

- [ ] Manual policy audit of core bot module: item doc comments and re-export visibility
- [ ] Upgrade MJS lint scripts with syn-based Rust parsing
- [ ] Converge RDD philosophy discussion and draft ARCHITECTURE.md

## Completed

- [x] Make Provider error-context subject projection explicit across business contexts
- [x] Seed a minimal cargo-deny dependency policy as infrastructure groundwork
- [x] Upgrade SettingsError to Context+Failure split, matching Provider pattern
