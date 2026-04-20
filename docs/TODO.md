# CRUD Refinement Tasks

Branch: `feat/spirit-crud-closeout`

## Functional Correctness

### Critical (影响数据一致性和用户体验)

- [x] **reset.rs** - Return critical error when rollback fails (inform user of inconsistent state)
- [x] **useProviderConnect** - Move concurrent guard to store layer (prevent cross-instance races)
- [x] **useToggleModels** - Fix default model state inconsistency (align frontend `?? false` with backend logic)
- [x] **useToggleModels** - Add error handling for exceptions during optimistic updates (ensure rollback)
- [x] **persistence.rs** - Implement atomic writes (temp file + rename) to prevent file corruption on crash
- [x] **reset.rs** - Complete idempotent closure: also attempt `remove_provider_key` on `!config_removed` path (prevent orphan keyring entries)

### High (影响功能正确性)

- [x] **connect.rs** - Defensive key rollback: snapshot adjacent to write + CAS guard before rollback (close race windows without introducing new locks)
- [x] **useProviderReset** - Write FAILED state + errorMessage on failure path (keep frontend aligned with backend real state)

### Medium (边界情况处理)

- [x] `useProviderConnect` - Add pending state guard (prevent concurrent connect operations)
- [x] **validators/cardStateGuard** - New guard to skip lifecycle events when card is PENDING (prevent visual flicker during user-initiated reconnect)

## Code Quality

### High (影响代码正确性)

- [x] **crud.ts** - Extract common error handling logic (reduce duplication across connect/reset/update)

### Medium (代码可维护性)

- [x] **connect.rs** - Rename `resolved_key_guard` to `fallback_key` (clarify logic flow)
- [x] **connect.rs** - Reorder enabled_models by available_models order (stable frontend rendering)
- [x] **connect.rs** - Extract key resolution logic to separate function (lines 54-58, improve testability)
- [x] **crud.ts** - Extract `SuccessResponse` to shared contract types as `MutationResponse` (new `response.ts`; connect/update/reset all reuse)

### Low (性能优化)

- [x] **useToggleModels** - Optimize rollback to only update enabled state (avoid full re-render)

## Backend Optimization

### High (架构改进)

- [x] **persistence.rs** - Add `File::sync_all()` + parent dir fsync before rename (ensure atomic write survives power loss)

### Medium (可靠性和性能)

- [x] Extract key rollback logic to standalone function (improve testability)
- [x] **connection/** - Make health check timeout configurable (use constants per provider)
- [x] **connection/** - Add HTTP client connection pooling (reuse connections across requests)

## Contract Upgrade

- [x] `connect_and_save` - Return dedicated `ConnectAndSaveProviderResponse` (with enabled_models)
- [x] `HealthCheckResponse` - Narrow responsibility to health check results only
- [x] Backend contract structure - Create `contract/connect.rs` for frontend-backend contracts
- [x] Frontend contract structure - Create `contract/connect.ts` mirroring backend structure
- [x] Frontend enabled models - Use backend `enabledModels` instead of hardcoded false
- [x] `resetProvider` - Return structured response ({ success, error? }), align with connectAndSaveProvider
- [x] `updateEnabledModels` - Return structured response ({ success, error? }), align with connectAndSaveProvider
