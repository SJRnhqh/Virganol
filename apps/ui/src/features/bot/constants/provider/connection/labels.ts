// apps/ui/src/features/bot/constants/provider/connection/labels.ts
// 内部引用
import type { ProviderCardState } from "@/features/bot/types";

/** Provider 连接状态文本标签映射 */
export const CONNECTION_STATE_LABELS: Record<ProviderCardState, string> = {
  unset: "Connect",
  pending: "Connecting",
  connected: "Connected",
  failed: "Retry",
};
