// apps/ui/src/features/bot/services/events/provider/handlers/schedulers/checkPhaseScheduler.ts
// TODO: check phase scheduler 当前已覆盖 checking -> terminal -> idle 的主时序，
// 但该模块仍需后续专项审查。
// 重点确认 timer 生命周期、cleanup 边界以及与 handlers/dispatcher 职责的最终收口方式。
// 内部引用
import type { ProviderCheckTrigger } from "@/features/bot/types/provider/contract/events";
import { PROVIDER_CHECK_DELAYS } from "@/features/bot/constants";
import { useProviderCheckStore } from "@/features/bot/store";
import { isCurrentRun } from "../validators";

type CheckTerminalPhase = "done" | "degraded";
type TimerHandle = ReturnType<typeof setTimeout>;

let activeRunId: string | null = null;
let checkingStartedAt: number | null = null;
let terminalTimer: TimerHandle | null = null;
let idleResetTimer: TimerHandle | null = null;

const clearTimer = (timer: TimerHandle | null): null => {
  if (timer) {
    clearTimeout(timer);
  }

  return null;
};

const clearScheduledTimers = () => {
  terminalTimer = clearTimer(terminalTimer);
  idleResetTimer = clearTimer(idleResetTimer);
};

const scheduleIdleReset = (runId: string, delayMs: number) => {
  idleResetTimer = setTimeout(() => {
    if (activeRunId !== runId || !isCurrentRun(runId)) {
      return;
    }

    useProviderCheckStore.getState().reset();
    activeRunId = null;
    checkingStartedAt = null;
    idleResetTimer = null;
  }, delayMs);
};

const getCheckingCompensationDelay = () => {
  if (checkingStartedAt === null) {
    return 0;
  }

  const elapsedMs = Date.now() - checkingStartedAt;
  return Math.max(0, PROVIDER_CHECK_DELAYS.CHECKING_DONE - elapsedMs);
};

const getIdleDelayForTerminalPhase = (phase: CheckTerminalPhase) => {
  return phase === "degraded"
    ? PROVIDER_CHECK_DELAYS.DEGRADED_IDLE
    : PROVIDER_CHECK_DELAYS.DONE_IDLE;
};

export function scheduleCheckStarted(
  runId: string,
  trigger: ProviderCheckTrigger,
) {
  clearScheduledTimers();

  activeRunId = runId;
  checkingStartedAt = Date.now();
  useProviderCheckStore.getState().setChecking(runId, trigger);
}

export function scheduleCheckCompleted(
  runId: string,
  phase: CheckTerminalPhase,
) {
  terminalTimer = clearTimer(terminalTimer);
  idleResetTimer = clearTimer(idleResetTimer);

  terminalTimer = setTimeout(() => {
    if (activeRunId !== runId || !isCurrentRun(runId)) {
      return;
    }

    const checkStore = useProviderCheckStore.getState();
    if (phase === "degraded") {
      checkStore.setDegraded();
    } else {
      checkStore.setDone();
    }

    terminalTimer = null;
    scheduleIdleReset(runId, getIdleDelayForTerminalPhase(phase));
  }, getCheckingCompensationDelay());
}

export function scheduleCheckFailed(
  runId: string,
  code: string,
  message: string,
) {
  terminalTimer = clearTimer(terminalTimer);
  idleResetTimer = clearTimer(idleResetTimer);

  terminalTimer = setTimeout(() => {
    if (activeRunId !== runId || !isCurrentRun(runId)) {
      return;
    }

    useProviderCheckStore.getState().setFailed(code, message);
    terminalTimer = null;
    scheduleIdleReset(runId, PROVIDER_CHECK_DELAYS.FAILED_IDLE);
  }, getCheckingCompensationDelay());
}

export function disposeCheckPhaseScheduler() {
  clearScheduledTimers();
  activeRunId = null;
  checkingStartedAt = null;
}
