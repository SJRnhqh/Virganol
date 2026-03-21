// apps/ui/src/features/bot/services/api/provider/check.ts
// 外部依赖
import { invoke } from "@tauri-apps/api/core";

// 同一时刻只允许一轮生命周期检查，startup 和 manual 共享去重
let checkInFlight: Promise<void> | null = null;

const triggerCheckLifecycle = (command: string): Promise<void> => {
  if (checkInFlight) return checkInFlight;

  checkInFlight = invoke<void>(command)
    .catch((error) => {
      console.error(`[API] ${command} error:`, error);
      throw error;
    })
    .finally(() => {
      checkInFlight = null;
    });

  return checkInFlight;
};

/** 启动时触发生命周期检查（配合 listen 使用） */
export const triggerProviderStartupCheck = (): Promise<void> =>
  triggerCheckLifecycle("trigger_provider_startup_check");

/** 手动刷新触发生命周期检查 */
export const triggerProviderManualRefresh = (): Promise<void> =>
  triggerCheckLifecycle("trigger_provider_manual_refresh");
