// apps/ui/src/features/bot/services/events/provider/handlers/validators/runGuard.ts
// 内部引用
import { useProviderCheckStore } from "@/features/bot/store";

export type RunDisposition = "current" | "orphan" | "stale";

/**
 * 统一判定某个事件所属 run_id 与当前前端活跃轮次的关系。
 *
 * - current: 与当前活跃 run 一致，可正常消费
 * - orphan: 前端尚未登记 run_id（例如 started 未到达），仅部分事件允许兜底处理
 * - stale: 明确属于旧 run，应直接丢弃避免串扰
 */
export function resolveRunDisposition(runId: string): RunDisposition {
  const currentRunId = useProviderCheckStore.getState().runId;

  if (currentRunId === null) {
    return "orphan";
  }

  return currentRunId === runId ? "current" : "stale";
}
