// apps/ui/src/features/bot/services/events/provider/listen.ts
// TODO: 当前 listen -> handlers -> schedulers 链路已具备可用功能，
// 但调度清理边界仍待专项审查。提交当前版本可以作为阶段性结果，
// 后续需在充分理解整体时序后再决定是否继续收口或回调实现细节。
// 外部依赖
import { listen } from "@tauri-apps/api/event";

// 内部引用
import type {
  ProviderCheckEvent,
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
} from "@/features/bot/types";
import { PROVIDER_CHECK_EVENTS } from "@/features/bot/constants";
import {
  handleFailed,
  handleStarted,
  handleCompleted,
  handleProviderStatus,
} from "./handlers";
import { disposeCheckPhaseScheduler } from "./handlers/schedulers";

type ListenerCleanup = () => void;

/**
 * 统一清理已注册成功的监听。
 * 用于注册失败时回滚，或组件卸载时批量回收句柄。
 */
const cleanupRegisteredListeners = (cleanups: ListenerCleanup[]) => {
  disposeCheckPhaseScheduler();

  while (cleanups.length > 0) {
    const cleanup = cleanups.pop();
    try {
      cleanup?.();
    } catch (error) {
      console.error("[React] cleanup failed:", error);
    }
  }
};

/**
 * 注册单个生命周期事件监听，并收集 cleanup 句柄。
 * 若注册失败，则回滚已成功注册的监听并抛出带事件名的错误。
 */
const registerListener = async (
  checkEvent: ProviderCheckEvent,
  register: () => Promise<ListenerCleanup>,
  cleanups: ListenerCleanup[],
) => {
  try {
    const cleanup = await register();
    cleanups.push(cleanup);
  } catch (error) {
    cleanupRegisteredListeners(cleanups);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[React] failed to register ${checkEvent}: ${message}`);
  }
};

/**
 * 串行注册 4 种生命周期事件监听，并返回统一 cleanup 函数。
 * 若中途注册失败，则回滚已成功注册的监听；在 App 启动时调用一次，卸载时调用返回值清理。
 */
export async function registerCheckListeners(): Promise<() => void> {
  const cleanups: ListenerCleanup[] = [];

  await registerListener(
    PROVIDER_CHECK_EVENTS.STARTED,
    () =>
      listen<ProviderCheckStartedPayload>(PROVIDER_CHECK_EVENTS.STARTED, (e) =>
        handleStarted(e.payload),
      ),
    cleanups,
  );

  await registerListener(
    PROVIDER_CHECK_EVENTS.PROVIDER_STATUS,
    () =>
      listen<ProviderStatusPayload>(
        PROVIDER_CHECK_EVENTS.PROVIDER_STATUS,
        (e) => handleProviderStatus(e.payload),
      ),
    cleanups,
  );

  await registerListener(
    PROVIDER_CHECK_EVENTS.COMPLETED,
    () =>
      listen<ProviderCheckCompletedPayload>(
        PROVIDER_CHECK_EVENTS.COMPLETED,
        (e) => handleCompleted(e.payload),
      ),
    cleanups,
  );

  await registerListener(
    PROVIDER_CHECK_EVENTS.FAILED,
    () =>
      listen<ProviderCheckFailedPayload>(PROVIDER_CHECK_EVENTS.FAILED, (e) =>
        handleFailed(e.payload),
      ),
    cleanups,
  );

  return () => cleanupRegisteredListeners(cleanups);
}
