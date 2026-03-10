// apps/ui/src/features/bot/types/index.ts
// 导出内容
export type {
  // ── Provider 标识与基础类型 ──
  ProviderId,

  // ── Provider 定义与注册 ──
  ProviderField,
  ProviderDefinition,
  ProviderRegistryEntry,

  // ── Provider 命令与响应 ──
  ConnectAndSaveProviderPayload,
  HealthCheckResponse,

  // ── Provider 生命周期事件 ──
  ProviderIssue,
  ProviderCheckStartedPayload,
  ProviderStatusPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,

  // ── Provider 状态管理 ──
  ProviderFormData,
  ProviderModelState,
  ProviderState,
  ProviderCollectionState,
  ProviderCheckState,

  // ── Provider UI Props ──
  ProviderConnectionProps,
  ProviderModelProps,
} from "./provider";
