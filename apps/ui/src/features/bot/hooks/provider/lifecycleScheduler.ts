// apps/ui/src/features/bot/hooks/provider/lifecycleScheduler.ts
// 内部引用
import type { ProviderIssue } from "@/features/bot/types";
import { PROVIDER_CHECK_DELAYS } from "@/features/bot/constants";
import { useProviderCheckStore } from "@/features/bot/store";
import { isCurrentRun } from "./runGuard";

/** 模块级 timer，用于 done/degraded/failed → idle 回归 */
let idleTimer: ReturnType<typeof setTimeout> | null = null;
/** 模块级 timer，用于 checking → 终态补足延迟 */
let checkingTimer: ReturnType<typeof setTimeout> | null = null;

function clearIdleTimer() {
  if (idleTimer !== null) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
}

function clearCheckingTimer() {
  if (checkingTimer !== null) {
    clearTimeout(checkingTimer);
    checkingTimer = null;
  }
}

/** 启动 idle 回归 timer */
function scheduleIdleReset(runId: string, delay: number) {
  clearIdleTimer();
  idleTimer = setTimeout(() => {
    idleTimer = null;
    if (!isCurrentRun(runId)) return;
    useProviderCheckStore.getState().reset();
  }, delay);
}

/** 清除所有 pending timer，用于新一轮 check 开始时重置 */
export function clearAllTimers() {
  clearIdleTimer();
  clearCheckingTimer();
}

/** 补足 checking 展示后进入 done，随后回归 idle */
export function scheduleCheckingDone(runId: string) {
  clearCheckingTimer();
  checkingTimer = setTimeout(() => {
    checkingTimer = null;
    if (!isCurrentRun(runId)) return;
    useProviderCheckStore.getState().setDone();
    scheduleIdleReset(runId, PROVIDER_CHECK_DELAYS.DONE_IDLE);
  }, PROVIDER_CHECK_DELAYS.CHECKING_DONE);
}

/** 补足 checking 展示后进入 degraded，随后回归 idle */
export function scheduleCheckingDegraded(runId: string, failedCount: number) {
  clearCheckingTimer();
  checkingTimer = setTimeout(() => {
    checkingTimer = null;
    if (!isCurrentRun(runId)) return;
    useProviderCheckStore
      .getState()
      .setDegraded(`${failedCount} provider check(s) failed`);
    scheduleIdleReset(runId, PROVIDER_CHECK_DELAYS.DEGRADED_IDLE);
  }, PROVIDER_CHECK_DELAYS.CHECKING_DONE);
}

/** 补足 checking 展示后进入 failed，随后回归 idle */
export function scheduleCheckingFailed(
  runId: string,
  code: string,
  message?: string,
  issues?: ProviderIssue[],
) {
  clearCheckingTimer();
  checkingTimer = setTimeout(() => {
    checkingTimer = null;
    if (!isCurrentRun(runId)) return;
    useProviderCheckStore.getState().setFailed(code, message, issues);
    scheduleIdleReset(runId, PROVIDER_CHECK_DELAYS.FAILED_IDLE);
  }, PROVIDER_CHECK_DELAYS.CHECKING_DONE);
}
