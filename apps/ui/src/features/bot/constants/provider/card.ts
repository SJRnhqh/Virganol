// apps/ui/src/features/bot/constants/provider/card.ts
/** 单个 Provider 卡片状态（前端渲染主状态） */
export const PROVIDER_CARD_STATES = {
  UNSET: "unset",
  PENDING: "pending",
  CONNECTED: "connected",
  FAILED: "failed",
} as const;

export type ProviderCardState =
  (typeof PROVIDER_CARD_STATES)[keyof typeof PROVIDER_CARD_STATES];
