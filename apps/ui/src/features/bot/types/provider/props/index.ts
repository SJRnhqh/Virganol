// apps/ui/src/features/bot/types/provider/props/index.ts
// 导出内容

export type { WithProviderId } from "./id";
export type { WithProviderConnection } from "./connection";
export type {
  ProviderEditableState,
  ProviderFailedState,
  WithCardState,
} from "./state";
export type { WithProviderForm, ProviderFormProps } from "./form";
export type { ProviderInfo } from "./info";
export type { ProviderFailedContent, ProviderErrorPanelProps } from "./error";
export type { ProviderCardProps } from "./card";
export type { ProviderCardBodyProps } from "./body";
export type {
  ProviderCardActionsProps,
  ProviderCardActionsPropsByState,
} from "./actions";
export type {
  ProviderCardContentProps,
  ProviderCardContentPropsByState,
} from "./content";
export type {
  ProviderConnectionInfo,
  ProviderConnectedPanelProps,
} from "./connected";
export type { ProviderCardHeaderProps } from "./header";
export type {
  ProviderButtonAction,
  ProviderConnectionButtonProps,
  ProviderModelToggleButtonProps,
  ProviderResetButtonProps,
} from "./button";
