// apps/ui/src/features/bot/types/provider/contract/index.ts
// 导出内容

// ── Provider 生命周期事件 ──
export type {
  ProviderIssue,
  ProviderCheckEvent,
  ProviderCheckTrigger,
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
} from "./events";

// ── Provider Connect 契约 ──
export type {
  ConnectAndSaveProviderPayload,
  ConnectAndSaveProviderResponse,
} from "./connect";

// ── Provider Reset 契约 ──
export type { ResetProviderResponse } from "./reset";

// ── Provider Update 契约 ──
export type {
  UpdateEnabledModelsPayload,
  UpdateEnabledModelsResponse,
} from "./update";

// ── Provider 持久化记录 ──
export type { ProviderRecord } from "./record";
