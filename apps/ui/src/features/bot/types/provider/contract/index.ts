// apps/ui/src/features/bot/types/provider/contract/index.ts
// 导出内容
export type {
  ProviderIssue,
  ProviderCheckTrigger,
  ProviderCheckStartedPayload,
  ProviderStatusPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,
} from "./events";
export type {
  ConnectAndSaveProviderPayload,
  HealthCheckResponse,
} from "./commands";
export type { ProviderRecord } from "./record";
