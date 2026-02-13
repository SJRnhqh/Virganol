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
    // ① 注册监听：后端每检查完一个 Provider 就推送一次
    const unlisten = listen<ProviderStatusPayload>("provider-status", (event) => {
      const { provider_id, config, health } = event.payload;

      // 校验 provider_id 是否为前端已知的 Provider
      if (!(provider_id in PROVIDER_DEFINITIONS)) {
        console.warn(`[Startup] Unknown provider: ${provider_id}, skipping`);
        return;
      }

      const id = provider_id as ProviderId;

      // 填入配置（后端字段 → 前端字段映射）
      const frontendConfig: Record<string, string> = {};
      if (config.url) frontendConfig.apiURL = config.url;
      if (config.key !== undefined) frontendConfig.apiKey = config.key;
      setProviderConfig(id, frontendConfig);

      // 填入连接状态
      setProviderStatus(id, {
        isConnected: health.success,
        isLoading: false,
        isError: !health.success,
        errorMessage: health.error,
      });

      // 填入模型信息（仅健康检查成功时）
      if (health.success && health.available_models.length > 0) {
        // setAvailableModels 内部会默认所有模型 enabled = true
        setAvailableModels(id, health.available_models);

        // 根据持久化的 enabled_models 修正：不在列表里的设为 false
        const enabledSet = new Set(config.enabled_models);
        health.available_models.forEach((model) => {
          if (!enabledSet.has(model)) {
            setModelEnabled(id, model, false);
          }
        });
      }

      console.log(
        `[Startup] ${id}: online=${health.success}, models=${health.available_models.length}`
      );
    });

    // ② 监听注册完毕后，通知后端开始检查
    triggerProvidersStartupCheck();

    // ③ 组件卸载时清理监听
    return () => {
      unlisten.then((fn) => fn());
    };
  }, [setProviderConfig, setProviderStatus, setAvailableModels, setModelEnabled]);
};