// apps/ui/src/features/bot/types/provider/props/error.ts
// 内部引用
import type { ProviderInfo } from "./info";

/**
 * Provider 错误面板 Props（失败态内容）
 */
export interface ProviderErrorPanelProps {
  /** Provider 信息（用于调用 reset 钩子） */
  provider: Pick<ProviderInfo, "id">;
  /** 当前失败态错误文案 */
  errorMessage?: string | null;
}
