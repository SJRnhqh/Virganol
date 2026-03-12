// apps/ui/src/features/bot/types/provider/props/state.ts
// 内部引用
import type { ProviderCardState } from "../state";

/**
 * Provider 卡片状态 Props：包含当前卡片状态
 * 用于所有需要根据卡片状态渲染的组件
 */
export interface WithCardState {
  /** 当前 Provider 卡片状态 */
  cardState: ProviderCardState;
}
