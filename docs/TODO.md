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

- [ ] `ProviderResetButton` - icon and interaction review
- [ ] `ProviderCardActions` - reset button integration
- [ ] Confirmation dialog (if needed) and UX polish

---

### 3. Update Models Chain Audit

**Entry Point**: `ProviderCardBody` (model checkboxes) → `useProviderModelList`

#### 3.1 API Layer

- [ ] `services/api/provider/updateModels.ts` - invoke contract and error handling
- [ ] Request payload construction (providerId/enabledModels)
- [ ] Response handling

#### 3.2 Hooks Layer

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

## Out of Scope

- Error granularity enhancement (Phase 6.1)
- Log standardization (Phase 6.2)
- Performance optimization (Phase 6.3)
- Backend changes (already audited in previous branch)
