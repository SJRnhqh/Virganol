// apps/ui/src/features/bot/types/provider/state/check.ts
// 内部引用
import type { ProviderCheckPhase } from "@/features/bot/constants";
import type { ProviderCheckTrigger, ProviderIssue } from "../contract";

// ── Provider Check（生命周期全局状态）───

export interface ProviderCheckState {
  /** 生命周期全局阶段（idle/checking/done/degraded/failed）。 */
  phase: ProviderCheckPhase;
  /** 当前轮次唯一标识（用于事件防串扰）。 */
  runId: string | null;
  /** 当前轮次触发来源（startup/manual_refresh）。 */
  trigger: ProviderCheckTrigger | null;
  /** 可定位到具体 Provider 的问题列表。 */
  issues: ProviderIssue[];
  /** 结构化错误码（结构性失败时使用）。 */
  errorCode: string | null;
  /** 全局错误文案（结构性失败时使用）。 */
  errorMessage: string | null;

  /** 切换到 checking 阶段并记录本轮 run 信息。 */
  setChecking: (runId: string, trigger: ProviderCheckTrigger) => void;
  /** 切换到 done 阶段 */
  setDone: () => void;
  /** 切换到 degraded 阶段（业务性失败）。 */
  setDegraded: (message?: string) => void;
  /** 切换到 failed 阶段（结构性失败）。 */
  setFailed: (code: string, message?: string, issues?: ProviderIssue[]) => void;
  /** 回到初始生命周期状态。 */
  reset: () => void;
}
