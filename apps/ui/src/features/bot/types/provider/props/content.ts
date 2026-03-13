// apps/ui/src/features/bot/types/provider/props/content.ts
// 内部引用
import type { ProviderCardState } from "../state";
import type {
  ProviderEditableContent,
  ProviderFailedContent,
  ProviderConnectedContent,
} from "./content-payload";

type ProviderCardContentMap = {
  unset: ProviderEditableContent;
  pending: ProviderEditableContent;
  failed: ProviderFailedContent;
  connected: ProviderConnectedContent;
};

/**
 * ProviderCardContent 组件 Props：基于 cardState 自动推断 cardContent 类型
 * - unset/pending → ProviderEditableContent
 * - failed → ProviderFailedContent
 * - connected → ProviderConnectedContent
 */
export type ProviderCardContentProps = {
  [State in ProviderCardState]: {
    cardState: State;
    cardContent: ProviderCardContentMap[State];
  };
}[ProviderCardState];
