// apps/ui/src/features/bot/constants/provider/lifecycle/phases.ts
/** Provider 生命周期阶段（前端状态机） */
export const PROVIDER_CHECK_PHASES = {
  IDLE: "idle",
  CHECKING: "checking",
  DONE: "done",
  DEGRADED: "degraded",
  FAILED: "failed",
} as const;

export type ProviderCheckPhase =
  (typeof PROVIDER_CHECK_PHASES)[keyof typeof PROVIDER_CHECK_PHASES];
