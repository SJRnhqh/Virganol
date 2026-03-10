// apps/ui/src/features/bot/types/index.ts
// 导出内容

export type {
  // ── Provider 标识与注册 ──
  ProviderId,
  ProviderField,
  ProviderDefinition,
  ProviderRegistryEntry,

  // ── Provider 契约类型 ──
  ProviderIssue,
  ProviderCheckEvent,
  HealthCheckResponse,
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ConnectAndSaveProviderPayload,

  // ── Provider 状态类型 ──
  ProviderState,
  ProviderFormData,
  ProviderCardState,
  ProviderCheckPhase,
  ProviderModelState,
  ProviderCheckState,
  ProviderCollectionState,

  // ── Provider UI Props ──
  ProviderModelProps,
  ProviderConnectionProps,
} from "./provider";
