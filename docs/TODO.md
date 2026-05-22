# feat/spirit-connect-and-error Branch Tasks

> Current branch closeout scope: connect call-chain simplification

---

## Completed Branch Work

- [x] Split provider commands into `provider/check.rs` and `provider/connect.rs`
- [x] Move reset contract under the manager contract module
- [x] Migrate connect contract to the generic provider command response shape
- [x] Align connect manager signature with reset/update command pattern
- [x] Rename update enabled models request data for contract consistency
- [x] Simplify connect flow and extract helper boundaries
- [x] Move provider connection probe helper into the connection layer
- [x] Relocate provider key model and keyring primitives under secret/store modules
- [x] Add Rust source header lint and workspace formatting config

## Connect Chain Closeout

- [x] Replace keyring rollback fallback with `ProviderKeyTransaction`
- [x] Confirm reset does not need the same transaction model
- [x] Move connect record construction into `ProviderRecord::from_connection`
- [x] Audit non-health-check error propagation points in `connect_and_save_provider`
