# Branch TODO

- Branch: feat/spirit-reliability-polish
- Goal: Polish Provider reliability architecture — Settings upgrade, policy audit, lint hardening, and architecture documentation

## Current

- [ ] Manual policy audit of core bot module: item doc comments and re-export visibility

## Planned

- [ ] Upgrade MJS lint scripts with syn-based Rust parsing
- [ ] Converge RDD philosophy discussion and draft ARCHITECTURE.md

## Completed

- [x] Upgrade SettingsError to Context+Failure split, matching Provider pattern
