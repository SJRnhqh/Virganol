// apps/ui/src/features/bot/types/provider/props/content.ts
// 内部引用
import type { ProviderCardState } from "../state";
import type { ProviderFailedContent } from "./error";
import type { WithProviderForm } from "./form";
import type { ProviderConnectedPanelProps } from "./connected";

type ProviderCardContentMap = {
  unset: WithProviderForm;
  pending: WithProviderForm;
  failed: ProviderFailedContent;
  connected: ProviderConnectedPanelProps;
};

/**
 * ProviderCardContent 组件 Props：基于 cardState 自动推断 cardContent 类型
 * - unset/pending → WithProviderForm
 * - failed → ProviderFailedContent
 * - connected → ProviderConnectedPanelProps
 */
export type ProviderCardContentProps = {
  [State in ProviderCardState]: {
    cardState: State;
    cardContent: ProviderCardContentMap[State];
  };
}[ProviderCardState];
