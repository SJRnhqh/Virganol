// apps/ui/src/features/bot/constants/provider/lifecycle/delays.ts
// 内部引用
import type { TerminalPhase } from "@/features/bot/types";

/** checking → 终态补足延迟（毫秒）：保证 checking 至少持续此时长 */
export const PROVIDER_CHECKING_DELAY = 800;

/** 终态 → idle 回归延迟映射（毫秒） */
export const PROVIDER_IDLE_DELAYS: Record<TerminalPhase, number> = {
  done: 1200,
  degraded: 2200,
  failed: 3500,
} as const;
