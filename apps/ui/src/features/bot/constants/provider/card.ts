// apps/ui/src/features/bot/constants/provider/card.ts
// 内部引用
import type { ProviderCardState } from "@/features/bot/types";

/** 单个 Provider 卡片状态常量 */
export const PROVIDER_CARD_STATES = {
  UNSET: "unset",
  PENDING: "pending",
  CONNECTED: "connected",
  FAILED: "failed",
} as const satisfies Record<string, ProviderCardState>;
