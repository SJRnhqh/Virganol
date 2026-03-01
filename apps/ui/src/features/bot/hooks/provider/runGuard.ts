// apps/ui/src/features/bot/hooks/provider/runGuard.ts
// 内部引用
import { useProviderCheckStore } from "@/features/bot/store";

/**
 * 判断某个事件/回调所属的 run_id 是否仍是当前活跃轮次。
 * 用于防止旧 run 的延迟事件写入最新状态。
 */
export function isCurrentRun(runId: string): boolean {
  return useProviderCheckStore.getState().runId === runId;
}
