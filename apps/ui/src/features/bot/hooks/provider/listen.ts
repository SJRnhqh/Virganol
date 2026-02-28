// apps/ui/src/features/bot/hooks/provider/listen.ts
// 外部依赖
import { listen } from "@tauri-apps/api/event";

// 内部引用
import type {
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,
  ProviderStatusPayload,
} from "@/features/bot/types";
import { PROVIDER_CHECK_EVENTS } from "@/features/bot/constants";
import {
  handleStarted,
  handleProviderStatus,
  handleCompleted,
  handleFailed,
} from "./handlers";

/**
 * 注册 4 种生命周期事件监听，返回统一 cleanup 函数。
 * 在 App 启动时调用一次，卸载时调用返回值清理。
 */
export async function registerCheckListeners(): Promise<() => void> {
  const [offStarted, offStatus, offCompleted, offFailed] = await Promise.all([
    listen<ProviderCheckStartedPayload>(PROVIDER_CHECK_EVENTS.STARTED, (e) => handleStarted(e.payload)),
    listen<ProviderStatusPayload>(PROVIDER_CHECK_EVENTS.PROVIDER_STATUS, (e) => handleProviderStatus(e.payload)),
    listen<ProviderCheckCompletedPayload>(PROVIDER_CHECK_EVENTS.COMPLETED, (e) => handleCompleted(e.payload)),
    listen<ProviderCheckFailedPayload>(PROVIDER_CHECK_EVENTS.FAILED, (e) => handleFailed(e.payload)),
  ]);

  return () => {
    offStarted();
    offStatus();
    offCompleted();
    offFailed();
  };
}
