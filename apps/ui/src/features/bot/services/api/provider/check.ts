// apps/ui/src/features/bot/services/api/provider/check.ts
// 外部依赖
import { invoke } from "@tauri-apps/api/core";

// 同一时刻只允许一轮生命周期检查，startup 和 manual 共享去重。
// 隐性契约：此单例隐含 triggerProviderStartupCheck 只在 App 顶层调用一次的前提，
// 若多处挂载 useProviderStartup，多个 startup 调用会共享同一 in-flight 锁，语义混乱。
//
// 注意：组件卸载时 in-flight 的 invoke 不会被取消（Tauri 不支持取消 invoke），
// 后端检查仍会执行完毕并推送事件，届时监听器已不存在，事件会被静默丢弃，属预期行为。
//
// 设计决策：manual refresh 的语义为「只要检查在跑就算」。
// startup 进行中触发 manual refresh 会复用 startup 的 promise，两者结果一致（相同的事件推送），
// 且竞态窗口极窄（用户能操作 UI 时 startup 基本已完成），无需排队等待后再发起新一轮。
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
