// apps/ui/src/features/bot/services/events/provider/handlers/schedulers/checkPhaseScheduler.ts
// 内部引用
import { PROVIDER_CHECK_DELAYS } from "@/features/bot/constants";

type CheckTerminalPhase = "done" | "degraded";
type TimerHandle = ReturnType<typeof setTimeout>;

// --- 模块状态 ---

// 当前活跃轮次的 run_id，用于防止旧轮次 timer 回调写入状态
let activeRunId: string | null = null;
// checking 阶段开始时间戳，用于计算补足延迟，保证 checking 至少持续 CHECKING_DONE ms
let checkingStartedAt: number | null = null;
let terminalTimer: TimerHandle | null = null;
let idleResetTimer: TimerHandle | null = null;

// --- 内部工具 ---

const clearTimer = (timer: TimerHandle | null): null => {
  if (timer) clearTimeout(timer);
  return null;
};

const clearScheduledTimers = () => {
  terminalTimer = clearTimer(terminalTimer);
  idleResetTimer = clearTimer(idleResetTimer);
};

const getCheckingCompensationDelay = () => {
  if (checkingStartedAt === null) return 0;
  const elapsedMs = Date.now() - checkingStartedAt;
  return Math.max(0, PROVIDER_CHECK_DELAYS.CHECKING_DONE - elapsedMs);
};

const getIdleDelayForTerminalPhase = (phase: CheckTerminalPhase) =>
  phase === "degraded"
    ? PROVIDER_CHECK_DELAYS.DEGRADED_IDLE
    : PROVIDER_CHECK_DELAYS.DONE_IDLE;

const scheduleIdleReset = (
  runId: string,
  delayMs: number,
  onIdle: () => void,
) => {
  idleResetTimer = setTimeout(() => {
    if (activeRunId !== runId) return;
    onIdle();
    activeRunId = null;
    checkingStartedAt = null;
    idleResetTimer = null;
  }, delayMs);
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
  terminalTimer = clearTimer(terminalTimer);
  idleResetTimer = clearTimer(idleResetTimer);

  terminalTimer = setTimeout(() => {
    if (activeRunId !== runId) return;
    onTerminal();
    terminalTimer = null;
    scheduleIdleReset(runId, getIdleDelayForTerminalPhase(phase), onIdle);
  }, getCheckingCompensationDelay());
}

// --- failed: checking → failed → idle ---

export function scheduleCheckFailed(
  runId: string,
  onFailed: () => void,
  onIdle: () => void,
) {
  terminalTimer = clearTimer(terminalTimer);
  idleResetTimer = clearTimer(idleResetTimer);

  terminalTimer = setTimeout(() => {
    if (activeRunId !== runId) return;
    onFailed();
    terminalTimer = null;
    scheduleIdleReset(runId, PROVIDER_CHECK_DELAYS.FAILED_IDLE, onIdle);
  }, getCheckingCompensationDelay());
}

// --- dispose: 清理所有 timer 与模块状态 ---

export function disposeCheckPhaseScheduler() {
  clearScheduledTimers();
  activeRunId = null;
  checkingStartedAt = null;
}
