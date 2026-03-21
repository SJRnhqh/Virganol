// apps/ui/src/features/bot/types/provider/index.ts
// 导出内容

// ── Provider 标识与定义 ──
export type { ProviderId } from "./common";

// ── Provider 契约类型 ──
export type {
  ProviderIssue,
  ProviderCheckEvent,
  ProviderCheckTrigger,
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
  TerminalPhase,
  CheckTerminalPhase,
  ProviderModelState,
  ProviderCheckState,
  ProviderBatchUpdates,
  ProviderCollectionState,
} from "./state";

// ── Provider UI Props ──
export type {
  ProviderEditableState,
  ProviderFailedState,
  WithProviderId,
  WithProviderForm,
  ProviderInfo,
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
  ProviderButtonAction,
  ProviderConnectionButtonProps,
  ProviderModelToggleButtonProps,
  ProviderResetButtonProps,
  ProviderConnectionInfo,
  ProviderConnectedPanelProps,
  WithProviderConnection,
} from "./props";

// ── Provider 自定义类型 ──
export type {
  IconSlot,
  ProviderFormField,
  ProviderFormVariantConfig,
  DualIconButton,
  ButtonAnimation,
} from "./custom";
