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
  WithProviderMeta,
  WithProviderId,
  WithProviderForm,
  ProviderFormContent,
  ProviderFormProps,
  ProviderFailedContent,
  ProviderErrorPanelProps,
  ProviderCardProps,
  ProviderModelProps,
  ProviderCardContentProps,
  ProviderCardHeaderProps,
  ProviderCardBodyProps,
  ProviderConnectionProps,
  ProviderConnectionButtonProps,
  ProviderConnectedContent,

  // ── Provider 自定义类型 ──
  IconSlot,
  DualIconButton,
  ButtonAnimation,
  ProviderFormField,
  ProviderFormVariantConfig,
} from "./provider";
