# CRUD Refinement Tasks

Branch: `feat/spirit-connect-react`

## Functional Correctness

- [ ] `useToggleModels` - Add pendingRef lock timeout (prevent UI freeze on API hang)
- [ ] `useToggleModels` - Add error handling for exceptions during optimistic updates (ensure rollback executes)
- [ ] `useProviderConnect` - Clear form on connect success (prevent sensitive data leak)
- [ ] `useProviderConnect` - Add pending state guard (prevent concurrent connect operations)
- [ ] `useProviderReset` - Add user feedback on reset failure (toast/notification, not just console.error)
- [ ] Backend `reset_provider_config` - Handle config rollback failure (prevent inconsistent state)

## UX Improvements

- [ ] `ProviderForm` - Add input validation (URL format / required fields / live feedback)
- [ ] `ProviderConnectionButton` - Add loading animation (pending state visual feedback)

## Code Quality

- [ ] `useProvider` - Fix onUpdate callback deps array (avoid stale closure)
- [ ] `useProvider` - Memoize onUpdate callback (prevent unnecessary re-renders)
- [ ] `useProviderModels` - Memoize modelItems calculation (performance optimization)
- [ ] `useProviderCollectionStore` - Add state transition validation (defensive updateProviderBatch)
- [ ] Check service - Prevent duplicate startup calls (resource optimization)
- [ ] Cleanup scattered TODO comments across codebase (consolidate or resolve)
- [ ] Add AbortController to cancel in-flight API requests on component unmount

## Backend Optimization

- [ ] Extract key rollback logic to standalone function (improve testability)
- [ ] Add retry mechanism and detailed status to reset flow (improve reliability)
- [ ] Add caching to persistence layer (reduce I/O amplification)
- [ ] Add timeout control to health checks (prevent infinite wait)
- [ ] Replace global `PROVIDERS_STORE_LOCK` with per-provider locks (improve concurrency)
- [ ] Add HTTP client connection pooling (reuse connections across requests)
- [ ] Fix key generation inconsistency (`to_string()` vs `as_str()` - critical data integrity issue)

## Contract Upgrade

- [ ] `connect_and_save` - Return dedicated `ConnectResponse` (with enabled_models), not reuse `HealthCheckResponse`
- [ ] `HealthCheckResponse` - Narrow responsibility to health check results only (remove fields/usage outside health check context)
- [ ] `resetProvider` - Return structured response ({ success, error? }), align with connectAndSaveProvider
- [ ] `updateEnabledModels` - Return structured response ({ success, error? }), align with connectAndSaveProvider

## Security

- [ ] `useProviderConnect` - Clear apiKey immediately after API call (minimize memory exposure)
- [ ] Remove console.log statements leaking sensitive operation details (provider IDs, timing)
- [ ] Add rate limiting to connect operations (prevent brute force key testing)

## Accessibility

- [ ] `ProviderForm` - Add aria-invalid and aria-describedby for validation errors
- [ ] `ProviderModelToggleButton` - Add aria-label with model name
- [ ] `ProviderResetButton` - Include provider name in aria-label
- [ ] Model list - Add keyboard navigation support (tab through models)
- [ ] Add focus management after connect/reset operations
