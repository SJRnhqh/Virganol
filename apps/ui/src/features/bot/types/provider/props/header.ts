// apps/ui/src/features/bot/types/provider/props/header.ts
// 内部引用
import type { WithProviderMeta } from "./meta";
import type { WithCardState } from "./state";

/**
 * ProviderCardHeader 组件 Props：包含头部渲染所需的最小输入
 * 用于 ProviderCardHeader 组件
 */
export interface ProviderCardHeaderProps extends WithCardState {
  /** Provider 展示元数据（名称、图标） */
  meta: WithProviderMeta;
  /** 当前卡片是否处于展开态 */
  open: boolean;
}
