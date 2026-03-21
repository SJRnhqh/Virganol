// apps/ui/src/features/bot/types/provider/props/state.ts
// 内部引用
import type { ProviderCardState } from "../state";

/**
 * Provider 卡片的可编辑阶段状态子集。
 * 覆盖配置输入与提交中的两个阶段：`unset` / `pending`。
 */
export type ProviderEditableState = Extract<
  ProviderCardState,
  "unset" | "pending"
>;

/**
 * Provider 卡片的失败阶段状态子集。
 * 用于失败态内容与错误面板的状态约束。
 */
export type ProviderFailedState = Extract<ProviderCardState, "failed">;

/**
 * Provider 卡片状态 Props：包含当前卡片状态
 * 用于所有需要根据卡片状态渲染的组件
 */
export interface WithCardState {
  /** 当前 Provider 卡片状态 */
  cardState: ProviderCardState;
}
