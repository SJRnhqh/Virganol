// apps/ui/src/features/bot/types/index.ts
// 导出内容

export type {
  // ── Provider 标识与定义 ──
  ProviderId,

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
  ProviderBatchUpdates,
  ProviderCollectionState,

  // ── Provider UI Props ──
  ProviderEditableState,
  ProviderFailedState,
  ProviderInfo,
  WithProviderId,
  WithProviderForm,
  ProviderFormProps,
  ProviderFailedContent,
  ProviderErrorPanelProps,
  ProviderCardProps,
  ProviderCardContentProps,
  ProviderCardHeaderProps,
  ProviderCardBodyProps,
  ProviderConnectionProps,
  ProviderConnectionButtonProps,
  ProviderModelToggleButtonProps,
  ProviderConnectedPanelProps,

  // ── Provider 自定义类型 ──
  IconSlot,
  DualIconButton,
  ButtonAnimation,
  ProviderFormField,
  ProviderFormVariantConfig,
} from "./provider";
