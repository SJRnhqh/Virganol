// apps/ui/src/features/bot/types/provider/props/error.ts
// 内部引用
import type { ProviderFailedState } from "./state";
import type { ProviderInfo } from "./info";

/**
 * Provider 失败态内容载荷。
 * 用于失败态内容路由。
 */
export interface ProviderFailedContent {
  /** Provider 信息（用于调用 reset 钩子） */
  provider: Pick<ProviderInfo, "id">;
  /** 当前失败态错误文案 */
  errorMessage?: string | null;
}

/**
 * Provider 错误面板 Props。
 * 在失败态内容载荷基础上补充当前失败态卡片状态。
 */
export interface ProviderErrorPanelProps extends ProviderFailedContent {
  /** 当前失败态卡片状态 */
  cardState: ProviderFailedState;
}
