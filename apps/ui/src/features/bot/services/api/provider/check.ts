// apps/ui/src/features/bot/services/api/provider/check.ts
// 外部依赖
import { invoke } from "@tauri-apps/api/core";

// 同一时刻只允许一轮生命周期检查，startup 和 manual 共享去重
// TODO: startup 进行中调用 manual refresh 会静默复用 startup 的 promise，
// 调用方无从感知自己的请求是否真正被执行。需明确 manual refresh 的语义：
// 是「确保一次新检查」还是「只要检查在跑就算」
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
