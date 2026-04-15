// apps/ui/src/features/bot/types/index.ts
// 导出内容

export type { TimerHandle } from "./shared";

export type {
  // ── Provider 标识与定义 ──
  ProviderId,

  // ── Provider 契约类型 ──
  ProviderIssue,
  ProviderCheckEvent,
  ProviderCheckTrigger,
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ConnectAndSaveProviderPayload,
  ConnectAndSaveProviderResponse,

  // ── Provider 状态类型 ──
  ProviderState,
  ProviderFormData,
  ProviderCardState,
  ProviderCheckPhase,
  TerminalPhase,
  CheckTerminalPhase,
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
  ProviderCardContentPropsByState,
  ProviderCardActionsProps,
  ProviderCardActionsPropsByState,
  ProviderCardHeaderProps,
  ProviderCardBodyProps,
  WithProviderConnection,
  ProviderButtonAction,
  ProviderConnectionButtonProps,
  ProviderModelToggleButtonProps,
  ProviderResetButtonProps,
  ProviderConnectionInfo,
  ProviderConnectedPanelProps,

  // ── Provider 自定义类型 ──
  IconSlot,
  DualIconButton,
  ButtonAnimation,
  ProviderFormField,
  ProviderFormVariantConfig,
} from "./provider";
