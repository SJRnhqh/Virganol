// apps/ui/src/features/bot/api/provider/check.ts
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
export const triggerProvidersStartupCheck = (): Promise<void> =>
  triggerCheckLifecycle("trigger_providers_startup_check");

/** 手动刷新触发生命周期检查 */
export const triggerProvidersManualRefresh = (): Promise<void> =>
  triggerCheckLifecycle("trigger_providers_manual_refresh");
