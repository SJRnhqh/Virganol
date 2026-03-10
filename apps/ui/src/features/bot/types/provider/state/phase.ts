// apps/ui/src/features/bot/types/provider/state/phase.ts

/** Provider 生命周期阶段（前端状态机） */
export type ProviderCheckPhase =
  | "idle"
  | "checking"
  | "done"
  | "degraded"
  | "failed";
