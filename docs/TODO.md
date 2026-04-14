# CRUD Refinement Tasks

Branch: `feat/spirit-connect-react`

## Functional Correctness

- [ ] `useToggleModels` - Add pendingRef lock timeout (prevent UI freeze on API hang)
- [ ] `useProviderConnect` - Clear form on connect success (prevent sensitive data leak)

## UX Improvements

- [ ] `ProviderForm` - Add input validation (URL format / required fields / live feedback)
- [ ] `ProviderConnectionButton` - Add loading animation (pending state visual feedback)

## Code Quality

- [ ] `useProvider` - Fix onUpdate callback deps array (avoid stale closure)
- [ ] `useProviderCollectionStore` - Add state transition validation (defensive updateProviderBatch)
- [ ] Check service - Prevent duplicate startup calls (resource optimization)

## Backend Optimization

- [ ] Extract key rollback logic to standalone function (improve testability)
- [ ] Add retry mechanism and detailed status to reset flow (improve reliability)
- [ ] Add caching to persistence layer (reduce I/O amplification)
- [ ] Add timeout control to health checks (prevent infinite wait)

## Contract Upgrade

- [ ] `connect_and_save` - Return dedicated `ConnectResponse` (with enabled_models), not reuse `HealthCheckResponse`
- [ ] `resetProvider` - Return structured response ({ success, error? }), align with connectAndSaveProvider
- [ ] `updateEnabledModels` - Return structured response ({ success, error? }), align with connectAndSaveProvider
