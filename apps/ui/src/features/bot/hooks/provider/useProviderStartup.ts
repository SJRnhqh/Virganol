// apps/ui/src/features/bot/hooks/provider/useProviderStartup.ts
// 外部依赖
import { useEffect } from "react";

// 内部引用
import { useProviderCheckStore } from "@/features/bot/store";
import {
  registerCheckListeners,
  triggerProviderStartupCheck,
} from "@/features/bot/services";

/**
 * 应用启动时：注册生命周期事件监听 + 触发 startup check
 * 在 App.tsx 中调用一次即可
 */
export const useProviderStartup = () => {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | null = null;

    const bootstrap = async () => {
      // 1) 注册 4 种生命周期事件监听
      try {
        cleanup = await registerCheckListeners();
      } catch (error) {
        console.error("[React] registerCheckListeners failed:", error);
        useProviderCheckStore
          .getState()
          .setFailed(
            "startup_listener_failed",
            error instanceof Error ? error.message : String(error),
          );
        return;
      }

      // 竞态保护：若组件在 registerCheckListeners await 期间卸载，
      // cleanup 会先将 disposed 置为 true，此处检测到后立即撤销监听器并中止后续流程。
      if (disposed) {
        cleanup!();
        return;
      }

      // 2) 触发后端 startup check（时序保证：先监听再触发）
      // 失败时立即调用 cleanup() 拆除监听器：startup check 属一次性生命周期，
      // 触发失败意味着本轮 check 已废，保留监听器只会让残留事件覆盖 failed 状态。
      try {
        await triggerProviderStartupCheck();
      } catch (error) {
        console.error("[React] triggerProviderStartupCheck failed:", error);
        cleanup();
        useProviderCheckStore
          .getState()
          .setFailed(
            "startup_trigger_failed",
            error instanceof Error ? error.message : String(error),
          );
      }
    };

    bootstrap().catch((error) => {
      console.error("[React] bootstrap unexpected error:", error);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
};
