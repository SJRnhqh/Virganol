// apps/ui/src/features/bot/hooks/providers/useProviderStartup.ts
// 外部依赖
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

// 内部引用
import type { ProviderId, ProviderStatusPayload } from "@/features/bot/types";
import { triggerProvidersStartupCheck } from "@/features/bot/api";
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { useProviderStore } from "@/features/bot/store";

/**
 * 应用启动时：监听后端推送的 provider-status 事件，填充 Store
 * 在 App.tsx 中调用一次即可
 */
export const useProviderStartup = () => {
  const setProviderConfig = useProviderStore((s) => s.setProviderConfig);
  const setProviderStatus = useProviderStore((s) => s.setProviderStatus);
  const setAvailableModels = useProviderStore((s) => s.setAvailableModels);
  const setModelEnabled = useProviderStore((s) => s.setModelEnabled);

  useEffect(() => {
    let disposed = false;
    let off: null | (() => void) = null;

    const bootstrap = async () => {
      // 1) 等监听真正注册完成
      off = await listen<ProviderStatusPayload>("provider-status", (event) => {
        const { provider_id, config, health } = event.payload;

        if (!(provider_id in PROVIDER_DEFINITIONS)) {
          console.warn(`[React] Unknown provider: ${provider_id}, skipping`);
          return;
        }

        const id = provider_id as ProviderId;

        const frontendConfig: Record<string, string> = {};
        if (config.url) frontendConfig.apiURL = config.url;
        setProviderConfig(id, frontendConfig);

        setProviderStatus(id, {
          isConnected: health.success,
          isLoading: false,
          isError: !health.success,
          errorMessage: health.error,
        });

        if (health.success && health.available_models.length > 0) {
          setAvailableModels(id, health.available_models);

          const enabledSet = new Set(config.enabled_models);
          health.available_models.forEach((model) => {
            if (!enabledSet.has(model)) {
              setModelEnabled(id, model, false);
            }
          });
        }

        console.log(
          `[React] ${id}: online=${health.success}, models=${health.available_models.length}`,
        );
      });

      // 组件已卸载则直接清理
      if (disposed) {
        off();
        return;
      }

      // 2) 再触发后端检查（时序保证）
      await triggerProvidersStartupCheck();
    };

    // 捕捉监听异常
    bootstrap().catch((error) => {
      console.error("[React] bootstrap failed:", error);
    });

    // 3) 卸载清理
    return () => {
      disposed = true;
      off?.();
    };
  }, [
    setProviderConfig,
    setProviderStatus,
    setAvailableModels,
    setModelEnabled,
  ]);
};
