# Frontend Audit for LLM Provider Configuration

> Branch-level task breakdown for frontend connect/reset/update_models chains

---

## Scope

Audit frontend implementation of CRUD operations (connect/reset/update_models), focusing on call chains, state management, and layer consistency.

---

## Audit Layers

```txt
Components → Hooks → Services/API → Store → Constants/Types/Icons
```

---

## Tasks

### 1. Connect Chain Audit

**Entry Point**: `ProviderConnectionButton` → `useProviderConnection.onConnect`

#### 1.1 API Layer

- [x] `services/api/provider/connect.ts` - invoke contract and error handling
- [x] Request payload construction (providerId/key/url normalization)
- [x] Response parsing and error mapping (error granularity deferred to Phase 6.1)

#### 1.2 Hooks Layer

- [x] `useProviderConnection.onConnect` - call chain and pre-state mutations
- [x] Loading state management (prevent duplicate triggers)
- [x] Error boundary integration (deferred to Phase 6.1, TODO added in crud.ts)

#### 1.3 Store Layer

- [x] `useProviderCollectionStore` - success/failure path symmetry
- [x] State rollback on failure (design already prevents issue: FAILED state hides form, Retry reuses formData from store)
- [x] `apiKey` memory cleanup after success
- [x] **Fixed**: `enabled` models initialized to `false` (aligned with backend `enabled_models: []`)

#### 1.4 Components Layer

- [x] `ProviderConnectionButton` - loading UI and disabled state (PENDING state disables button to prevent duplicate clicks)
- [x] `ProviderForm` - input validation and normalization (empty string acceptable, no frontend validation needed)

#### 1.5 Supporting Layers

- [x] Types: `ConnectRequest` / `ConnectResponse` completeness (contract boundary deferred to Phase 6.1, TODO added in useProviderConnection.ts)
- [x] Icons: connection state visual feedback

---

### 2. Reset Chain Audit

**Entry Point**: `ProviderResetButton` → `useProviderConnection.onReset`

#### 2.1 API Layer

- [x] `services/api/provider/crud.ts` - resetProvider migrated from providers.ts
- [x] Invoke contract and error handling (boolean return, deferred structure to Phase 6.2)
- [x] Response handling (success/failure distinction in hook layer)

#### 2.2 Backend Service Layer

- [x] `reset_provider_config` flow review (snapshot → config delete → key delete → rollback)
- [x] Persistence layer validation (load/remove/save contracts, lock consistency)
- [x] Error handling and logging (ProviderError propagation, message() method)
- [x] Idempotent design (config not found returns true with warn log)

#### 2.3 Hooks Layer

- [x] `useProviderConnection.handleReset` - success check + batch state reset
- [x] Error handling with logging placeholder (deferred to Phase 6.2)
- [x] Form cleanup consolidated into batch update

#### 2.4 Store Layer

- [x] `useProviderCollectionStore` - state cleanup design verified
- [x] `updateProviderBatch` supports form replacement (complete)
- [x] Three-value errorMessage semantics proper

#### 2.5 Types & Constants Layer

- [x] `ProviderBatchUpdates` interface complete and flexible
- [x] `CONNECTION_STATE_LABELS` mapping covers all states
- [x] Error structure extensible to Phase 6.2

#### 2.6 Components Layer

- [x] `ProviderResetButton` - extracted to standalone component with text + icon
- [x] `ProviderResetButton` - added variant prop for color adaptation (default/error)
- [x] `useProviderReset` - extracted to `hooks/provider/manager/` for reusability
- [x] `ProviderConnectedPanel` - integrated reset button in configuration management area
- [x] `ProviderCardActions` - removed reset from CONNECTED state (moved to content area)
- [x] `ProviderCardActions` - removed reset from FAILED state (moved to ErrorPanel)
- [x] `ProviderCardActions` - simplified to unified rendering (removed switch statement)
- [x] `ProviderCardActionsMap` - removed resetAction from type definition
- [x] `ProviderErrorPanel` - redesigned with dashed border style (aligned with ConnectedPanel)
- [x] `ProviderErrorPanel` - integrated reset button with error variant (red color scheme)
- [x] `ProviderErrorPanel` - removed redundant icon (header already shows status icon)
- [x] `ProviderErrorPanel` - right-aligned reset button for better visual hierarchy
- [x] `ProviderErrorPanel` - added fallback error message for null/empty cases
- [x] `ProviderErrorPanelProps` - interface tightened (removed cardState, aligned with ProviderConnectedPanelProps)
- [x] `ProviderFailedContent` - removed (replaced by ProviderErrorPanelProps as content type constraint)

---

### 3. Update Models Chain Audit

**Entry Point**: `ProviderCardBody` (model checkboxes) → `useProviderModelList`

#### 3.1 Backend Layer

- [x] `update_provider_enabled_models` service layer - business logic and logging
- [x] `update_models` store layer - persistence transaction with lock
- [x] `store/` directory refactoring - migrated from persistence.rs (load/save/remove/update/lock)
- [x] Logging optimization - persistence layer warn + service layer info/error

#### 3.2 API Layer

- [x] `services/api/provider/crud.ts` - invoke contract and error handling
- [x] Request payload construction (providerId/enabledModels)
- [x] Response handling

#### 3.3 Hooks Layer

- [ ] `useProviderModelList` - call chain and concurrency control
- [ ] `pendingRef` mutex lock verification
- [ ] Optimistic update vs server confirmation

#### 3.3 Store Layer

- [ ] `useProviderCollectionStore` - enabled_models state sync
- [ ] Rollback on failure

#### 3.4 Components Layer

- [ ] Model checkbox list - loading state during update
- [ ] Feedback on success/failure (toast/inline message)

#### 3.5 Supporting Layers

- [ ] Types: `UpdateModelsRequest` / `UpdateModelsResponse` completeness
- [ ] Constants: model-related error codes

---

### 4. Cross-Cutting Concerns

#### 4.1 Error Handling Consistency

- [ ] All three chains use consistent error display pattern
- [ ] Error codes mapped to user-friendly messages
- [ ] Network errors vs business errors distinction

#### 4.2 Loading State Consistency

- [ ] All operations show loading UI
- [ ] Buttons disabled during operations
- [ ] No race conditions on rapid clicks

#### 4.3 Type Safety

- [ ] No `any` types in CRUD chains
- [ ] Request/response types match backend contracts
- [ ] Error types properly typed (not just `string`)

#### 4.4 Constants Coverage

- [ ] All provider IDs in constants
- [ ] All error codes in constants
- [ ] No magic strings in components/hooks

---

### 5. Connect & Reset Chain Refinement (Post-Audit Findings)

#### 5.1 High Priority (Functional Correctness)

- [ ] #10: `useProviderModelList` - add timeout mechanism to `pendingRef` lock (prevent infinite pending state)
- [ ] #6: `useProviderConnection` - clear form completely after connect success (apiKey + apiURL)

#### 5.2 Medium Priority (User Experience)

- [ ] #7: `useProviderReset` - add error feedback to user (not just console.error)
- [ ] #9: API layer - unify error handling pattern (resetProvider should return `{ success, error }` like connectAndSaveProvider)
- [ ] #15: `ProviderForm` - add input validation (URL format, required fields, real-time feedback)
- [ ] #12: `ProviderConnectionButton` - add loading animation for pending state

#### 5.3 Low Priority (Code Quality & Performance)

- [ ] #17: `useProvider` - add dependency array to `onUpdate` callback
- [ ] #11: Store - add state transition validation in `updateProviderBatch`
- [ ] #16: Check service - add runtime check to prevent multiple startup check calls

#### 5.4 Phase 6 Deferred (Architecture & Performance)

- [ ] #1: Backend - extend `HealthCheckResponse` with `error_code` field for error classification
- [ ] #8: Frontend - split `HealthCheckResponse` into `ConnectResponse` (health + models)
- [ ] #2: Backend - extract key rollback logic into separate function for testability
- [ ] #3: Backend - add retry mechanism and detailed status for reset partial failures
- [ ] #4: Backend - add caching layer for persistence (reduce read/write amplification)
- [ ] #5: Backend - add timeout control to health check (prevent infinite waiting)
- [ ] #18: Define unified error code system (backend + frontend)
- [ ] #19: Define explicit state machine for state transitions
- [ ] #20: Add operation logging and audit trail

---

## Out of Scope

- Error granularity enhancement (Phase 6.1)
- Log standardization (Phase 6.2)
- Performance optimization (Phase 6.3)
- Backend changes (already audited in previous branch)
