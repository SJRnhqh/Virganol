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

// ── Provider 命令与响应 ──
export type {
  HealthCheckResponse,
  ConnectAndSaveProviderPayload,
} from "./commands";

// ── Provider 持久化记录 ──
export type { ProviderRecord } from "./record";
