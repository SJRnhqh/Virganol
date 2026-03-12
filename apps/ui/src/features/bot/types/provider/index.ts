// apps/ui/src/features/bot/types/provider/index.ts
// 导出内容

// ── Provider 标识与定义 ──
export type { ProviderId } from "./common";
export type { ProviderField, ProviderDefinition } from "./definition";

// ── Provider 契约类型 ──
export type {
  ProviderIssue,
  ProviderCheckEvent,
  HealthCheckResponse,
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ConnectAndSaveProviderPayload,
} from "./contract";

// ── Provider 状态类型 ──
export type {
  ProviderState,
  ProviderFormData,
  ProviderCardState,
  ProviderCheckPhase,
  ProviderModelState,
  ProviderCheckState,
  ProviderBatchUpdates,
  ProviderCollectionState,
} from "./state";

// ── Provider UI Props ──
export type {
  WithProviderId,
  ProviderCardProps,
  ProviderCardHeaderProps,
} from "./props";
export type { ProviderModelProps, ProviderConnectionProps } from "./base";
