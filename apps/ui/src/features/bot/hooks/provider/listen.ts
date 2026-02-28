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
import {
  handleStarted,
  handleProviderStatus,
  handleCompleted,
  handleFailed,
} from "./handlers";

const EVENT_STARTED = "providers-check-lifecycle-started";
const EVENT_PROVIDER_STATUS = "provider-status";
const EVENT_COMPLETED = "providers-check-lifecycle-completed";
const EVENT_FAILED = "providers-check-lifecycle-failed";

/**
 * 注册 4 种生命周期事件监听，返回统一 cleanup 函数。
 * 在 App 启动时调用一次，卸载时调用返回值清理。
 */
export async function registerCheckListeners(): Promise<() => void> {
  const [offStarted, offStatus, offCompleted, offFailed] = await Promise.all([
    listen<ProviderCheckStartedPayload>(EVENT_STARTED, (e) => handleStarted(e.payload)),
    listen<ProviderStatusPayload>(EVENT_PROVIDER_STATUS, (e) => handleProviderStatus(e.payload)),
    listen<ProviderCheckCompletedPayload>(EVENT_COMPLETED, (e) => handleCompleted(e.payload)),
    listen<ProviderCheckFailedPayload>(EVENT_FAILED, (e) => handleFailed(e.payload)),
  ]);

  return () => {
    offStarted();
    offStatus();
    offCompleted();
    offFailed();
  };
}
