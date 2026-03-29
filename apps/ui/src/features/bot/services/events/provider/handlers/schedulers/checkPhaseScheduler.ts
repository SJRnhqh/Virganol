// apps/ui/src/features/bot/services/events/provider/handlers/schedulers/checkPhaseScheduler.ts
// 内部引用
import type { CheckTerminalPhase, TimerHandle } from "@/features/bot/types";
import {
  PROVIDER_CHECKING_DELAY,
  PROVIDER_IDLE_DELAYS,
} from "@/features/bot/constants";

// --- 模块状态 ---
// 单例设计依赖「同一时刻只有一轮检查」的前提，由上层 checkInFlight 保证，属已知跨层依赖。

// 当前活跃轮次的 run_id，用于防止旧轮次 timer 回调写入状态
let activeRunId: string | null = null;
// checking 阶段开始时间戳，用于计算补足延迟，保证 checking 至少持续 CHECKING_DELAY ms
let checkingStartedAt: number | null = null;
// checking → 终态的过渡计时器（含补足延迟）
let toTerminalTimer: TimerHandle | null = null;
// 终态 → idle 的过渡计时器（展示时长结束后回归）
let toIdleTimer: TimerHandle | null = null;

// --- 内部工具 ---

const clearTimer = (timer: TimerHandle | null): null => {
  if (timer) clearTimeout(timer);
  return null;
};

const clearScheduledTimers = () => {
  toTerminalTimer = clearTimer(toTerminalTimer);
  toIdleTimer = clearTimer(toIdleTimer);
};

const getCompensationDelay = () => {
  if (checkingStartedAt === null) return 0;
  return Math.max(
    0,
    PROVIDER_CHECKING_DELAY - (Date.now() - checkingStartedAt),
  );
};

const scheduleIdleReset = (
  runId: string,
  delayMs: number,
  onIdle: () => void,
) => {
  toIdleTimer = setTimeout(() => {
    if (activeRunId !== runId) return;
    onIdle();
    activeRunId = null;
    checkingStartedAt = null;
    toIdleTimer = null;
  }, delayMs);
};

const scheduleTerminal = (
  runId: string,
  idleDelayMs: number,
  onTerminal: () => void,
  onIdle: () => void,
) => {
  clearScheduledTimers();

  toTerminalTimer = setTimeout(() => {
    if (activeRunId !== runId) return;
    onTerminal();
    toTerminalTimer = null;
    scheduleIdleReset(runId, idleDelayMs, onIdle);
  }, getCompensationDelay());
};

const claimFailedRunIfNeeded = (runId: string) => {
  if (activeRunId !== null) return;

  // failed 可能在 started 之前到达；此时认领本轮 run，
  // 让终态展示与 idle 回归仍能复用统一调度语义。
  activeRunId = runId;
  checkingStartedAt = null;
};

// --- started: 进入 checking 阶段 ---

export function scheduleCheckStarted(runId: string, onChecking: () => void) {
  clearScheduledTimers();
  activeRunId = runId;
  checkingStartedAt = Date.now();
  onChecking();
}

// --- completed: checking → done / degraded → idle ---

export function scheduleCheckCompleted(
  runId: string,
  phase: CheckTerminalPhase,
  onTerminal: () => void,
  onIdle: () => void,
) {
  scheduleTerminal(runId, PROVIDER_IDLE_DELAYS[phase], onTerminal, onIdle);
}

// --- failed: checking → failed → idle ---

export function scheduleCheckFailed(
  runId: string,
  onFailed: () => void,
  onIdle: () => void,
) {
  claimFailedRunIfNeeded(runId);
  scheduleTerminal(runId, PROVIDER_IDLE_DELAYS.failed, onFailed, onIdle);
}

// --- dispose: 清理所有 timer 与模块状态 ---

export function disposeCheckPhaseScheduler() {
  clearScheduledTimers();
  activeRunId = null;
  checkingStartedAt = null;
}
