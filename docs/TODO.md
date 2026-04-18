# CRUD Refinement Tasks

Branch: `feat/spirit-crud-closeout`

## Functional Correctness

### Critical (影响数据一致性和用户体验)

- [x] **reset.rs** - Return critical error when rollback fails (inform user of inconsistent state)
- [x] **useProviderConnect** - Move concurrent guard to store layer (prevent cross-instance races)
- [x] **useToggleModels** - Fix default model state inconsistency (align frontend `?? false` with backend logic)
- [x] **useToggleModels** - Add error handling for exceptions during optimistic updates (ensure rollback)
- [ ] **store/save.rs & update.rs** - Fix TOCTOU race condition in concurrent writes (prevent data loss)
- [ ] **ProviderResetButton** - Add confirmation dialog before reset (prevent accidental data loss)

### High (影响功能正确性)

- [ ] **connect.rs** - Fix key rollback race condition in concurrent scenarios (use atomic operations)

### Medium (边界情况处理)

- [x] `useProviderConnect` - Add pending state guard (prevent concurrent connect operations)

## Code Quality

### High (影响代码正确性)

- [x] **crud.ts** - Extract common error handling logic (reduce duplication across connect/reset/update)

### Medium (代码可维护性)

- [x] **connect.rs** - Rename `resolved_key_guard` to `fallback_key` (clarify logic flow)
- [x] **connect.rs** - Reorder enabled_models by available_models order (stable frontend rendering)
- [ ] **Check service** - Prevent duplicate startup calls (resource optimization)
- [ ] **useToggleModels** - Extract toEnabledList helper to shared utils (reusable across hooks)
- [x] **connect.rs** - Extract key resolution logic to separate function (lines 54-58, improve testability)

### Low (性能优化)

- [ ] **useToggleModels** - Optimize rollback to only update enabled state (avoid full re-render)

## Backend Optimization

### High (架构改进)

- [ ] **store/lock.rs** - Migrate to Tauri State or parking_lot::Mutex (prevent poison, improve testability)
- [ ] **Replace global PROVIDERS_STORE_LOCK** - Use per-provider locks (improve concurrency)

### Medium (可靠性和性能)

- [x] Extract key rollback logic to standalone function (improve testability)
- [ ] **store/** - Add caching to persistence layer (reduce I/O amplification)
- [ ] **connection/** - Make health check timeout configurable (currently hardcoded to 5s)
- [ ] **connection/** - Add HTTP client connection pooling (reuse connections across requests)

### Low (边界情况)

- [ ] **key/load.rs** - Add key length validation for env vars (prevent memory overflow, max 10KB)
- [ ] **useToggleModels** - Handle race between toggleSingle and toggleAll (shared pendingRef may cause conflicts)

## Contract Upgrade

- [x] `connect_and_save` - Return dedicated `ConnectAndSaveProviderResponse` (with enabled_models)
- [x] `HealthCheckResponse` - Narrow responsibility to health check results only
- [x] Backend contract structure - Create `contract/connect.rs` for frontend-backend contracts
- [x] Frontend contract structure - Create `contract/connect.ts` mirroring backend structure
- [x] Frontend enabled models - Use backend `enabledModels` instead of hardcoded false
- [x] `resetProvider` - Return structured response ({ success, error? }), align with connectAndSaveProvider
- [x] `updateEnabledModels` - Return structured response ({ success, error? }), align with connectAndSaveProvider

## Accessibility

### High (键盘导航和屏幕阅读器)

- [ ] **ProviderConnectedPanel** - Add keyboard navigation to model list (Tab key, Enter key)

### Medium（前端细节）

- [ ] **All interactive components** - Add focus management after connect/reset operations
