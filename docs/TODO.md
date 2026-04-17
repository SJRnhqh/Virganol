# CRUD Refinement Tasks

Branch: `feat/spirit-crud-closeout`

## Functional Correctness

### Critical (影响数据一致性和用户体验)

- [x] **reset.rs** - Return critical error when rollback fails (inform user of inconsistent state)
- [ ] **store/save.rs & update.rs** - Fix TOCTOU race condition in concurrent writes (prevent data loss)
- [ ] **useToggleModels** - Add pendingRef lock timeout mechanism (prevent permanent UI freeze)
- [ ] **useToggleModels** - Fix default model state inconsistency (align frontend `?? true` with backend logic)
- [ ] **useProviderConnect** - Move concurrent guard to store layer (prevent cross-instance races)
- [ ] **ProviderResetButton** - Add confirmation dialog before reset (prevent accidental data loss)

### High (影响功能正确性)

- [ ] **connect.rs** - Fix key rollback race condition in concurrent scenarios (use atomic operations)
- [ ] **reset.rs** - Check key deletability before removing config (ensure atomic reset)
- [ ] **update.rs** - Return tri-state result (success/failure/not-found) to sync frontend state
- [ ] **useToggleModels** - Add error handling for exceptions during optimistic updates (ensure rollback)
- [ ] **useProviderReset** - Add user feedback on reset failure (toast/notification)
- [ ] **crud.ts** - Distinguish IPC errors from business errors (enable targeted error handling)

### Medium (边界情况处理)

- [x] `useProviderConnect` - Add pending state guard (prevent concurrent connect operations)
- [ ] **useToggleModels** - Handle empty available array in allSelected calculation (prevent confusion)
- [ ] **useProviderConnect** - Clarify form field clearing policy after success (key vs URL consistency)

## Code Quality

### High (影响代码正确性)

- [ ] **useProvider** - Fix onUpdate callback deps array (avoid stale closure)
- [ ] **useProviderReset** - Add missing constants to deps array (PROVIDER_INITIAL_FORMS, PROVIDER_CARD_STATES)
- [ ] **useProviderCollectionStore** - Add state transition validation (defensive updateProviderBatch)
- [ ] **crud.ts** - Extract common error handling logic (reduce duplication across connect/reset/update)

### Medium (代码可维护性)

- [ ] **connect.rs** - Rename `resolved_key_guard` to `fallback_key` (clarify logic flow)
- [ ] **connect.rs** - Reorder enabled_models by available_models order (stable frontend rendering)
- [ ] **key/load.rs** - Simplify normalize_and_wrap_key logic (remove premature optimization)
- [ ] **ProviderCardBody** - Use stricter type checking for state mapping (ensure all states covered)
- [ ] **Check service** - Prevent duplicate startup calls (resource optimization)

### Low (性能优化)

- [ ] **useProvider** - Memoize onUpdate callback (prevent unnecessary re-renders)
- [ ] **useProviderModels** - Memoize modelItems calculation (performance optimization)
- [ ] **useToggleModels** - Optimize rollback to only update enabled state (avoid full re-render)
- [ ] **crud.ts** - Only log timing when operation exceeds threshold (reduce log noise)

## Backend Optimization

### High (架构改进)

- [ ] **store/lock.rs** - Migrate to Tauri State or parking_lot::Mutex (prevent poison, improve testability)
- [ ] **Replace global PROVIDERS_STORE_LOCK** - Use per-provider locks (improve concurrency)

### Medium (可靠性和性能)

- [x] Extract key rollback logic to standalone function (improve testability)
- [ ] **reset.rs** - Add retry mechanism and detailed status (improve reliability)
- [ ] **store/** - Add caching to persistence layer (reduce I/O amplification)
- [ ] **connection/** - Make health check timeout configurable (currently hardcoded to 5s)
- [ ] **connection/** - Add HTTP client connection pooling (reuse connections across requests)

### Low (边界情况)

- [ ] **key/load.rs** - Add key length validation for env vars (prevent memory overflow, max 10KB)
- [ ] **contract/connect.rs** - Add explicit serde rename annotations (improve code readability)

## Contract Upgrade

- [x] `connect_and_save` - Return dedicated `ConnectAndSaveProviderResponse` (with enabled_models)
- [x] `HealthCheckResponse` - Narrow responsibility to health check results only
- [x] Backend contract structure - Create `contract/connect.rs` for frontend-backend contracts
- [x] Frontend contract structure - Create `contract/connect.ts` mirroring backend structure
- [x] Frontend enabled models - Use backend `enabledModels` instead of hardcoded false
- [x] `resetProvider` - Return structured response ({ success, error? }), align with connectAndSaveProvider
- [x] `updateEnabledModels` - Return structured response ({ success, error? }), align with connectAndSaveProvider

## Security

### Medium

- [ ] **crud.ts** - Remove console.log statements leaking sensitive operation details (provider IDs, timing)
- [ ] **connect** - Add rate limiting to connect operations (prevent brute force key testing)
- [ ] **ProviderErrorPanel** - Ensure error messages are properly escaped (prevent XSS, verify no dangerouslySetInnerHTML)

## Accessibility

### High (键盘导航和屏幕阅读器)

- [ ] **ProviderConnectedPanel** - Add keyboard navigation to model list (Tab key, Enter key)
- [ ] **ProviderResetButton** - Add aria-describedby explaining reset consequences (not just aria-label)
- [ ] **ProviderConnectedPanel** - Add aria-label to connection info area (screen reader support)

### Medium（前端细节）

- [ ] **ProviderForm** - Add aria-invalid and aria-describedby for validation errors
- [ ] **ProviderModelToggleButton** - Add aria-label with model name
- [ ] **ProviderResetButton** - Include provider name in aria-label
- [ ] **All interactive components** - Add focus management after connect/reset operations

## User Experience

### High

- [ ] **ProviderErrorPanel** - Add Retry button (allow users to retry without reset)
- [ ] **ProviderConnectionButton** - Add loading indicator animation (show operation in progress)

### Medium（用户体验）

- [ ] **useProviderConnect** - Clarify form field clearing policy (document which fields are cleared on success)
- [ ] **useProviderCollectionStore** - Document partial update semantics in updateProviderBatch (prevent misuse)

### Low

- [ ] **ProviderConnectedPanel** - Implement virtual scrolling for large model lists (10000+ models)
- [ ] **ProviderConnectionButton** - Add layout property to Framer Motion (prevent layout shift)
