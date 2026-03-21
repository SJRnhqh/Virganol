// apps/ui/src/features/bot/services/events/provider/handlers/validators/runGuard.ts
// 内部引用
import { useProviderCheckStore } from "@/features/bot/store";

/**
 * 判断某个事件/回调所属的 run_id 是否仍是当前活跃轮次。
 * 用于防止旧 run 的延迟事件写入最新状态。
 */
export function isCurrentRun(runId: string): boolean {
  return useProviderCheckStore.getState().runId === runId;
}

/**
 * 判断某个事件是否属于已过时的轮次。
 * 与 isCurrentRun 的区别：runId 为 null（started 未到达）时返回 false，允许事件继续处理。
 */
export function isStaleRun(runId: string): boolean {
  const currentRunId = useProviderCheckStore.getState().runId;
  return currentRunId !== null && currentRunId !== runId;
}
