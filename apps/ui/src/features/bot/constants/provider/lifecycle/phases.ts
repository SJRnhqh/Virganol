// apps/ui/src/features/bot/constants/provider/lifecycle/phases.ts
// 内部引用
import type { ProviderCheckPhase } from "@/features/bot/types";

/** Provider 生命周期阶段常量 */
export const PROVIDER_CHECK_PHASES = {
  IDLE: "idle",
  CHECKING: "checking",
  DONE: "done",
  DEGRADED: "degraded",
  FAILED: "failed",
} as const satisfies Record<string, ProviderCheckPhase>;
