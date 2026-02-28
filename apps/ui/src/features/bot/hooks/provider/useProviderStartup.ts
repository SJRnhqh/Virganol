// apps/ui/src/features/bot/hooks/provider/useProviderStartup.ts
// 外部依赖
import { useEffect } from "react";

// 内部引用
import { triggerProviderStartupCheck } from "@/features/bot/api";
import { registerCheckListeners } from "./listen";

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
      cleanup = await registerCheckListeners();

      if (disposed) {
        cleanup();
        return;
      }

      // 2) 触发后端 startup check（时序保证：先监听再触发）
      await triggerProviderStartupCheck();
    };

    bootstrap().catch((error) => {
      console.error("[React] bootstrap failed:", error);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
};
