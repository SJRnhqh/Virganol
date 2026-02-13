// apps/ui/src/features/bot/hooks/providers/useProvider.ts
// 内部引用
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { updateEnabledModels } from "@/features/bot/api";
import { useProviderStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

import { useProviderConnection } from "./useProviderConnection";

export const useProvider = (providerId: ProviderId) => {
  // ── 读取 Store 数据 ────────────────────────
  const definition = PROVIDER_DEFINITIONS[providerId];
  const config = useProviderStore((state) => state.providerConfig[providerId]);
  const status = useProviderStore((state) => state.providerStatus[providerId]);
  const models = useProviderStore((state) => state.providerModels[providerId]);

  // ── Actions ────────────────────────────────
  const setProviderConfig = useProviderStore(
    (state) => state.setProviderConfig,
  );
  const setModelEnabled = useProviderStore((state) => state.setModelEnabled);
  const setAllModelsEnabled = useProviderStore(
    (state) => state.setAllModelsEnabled,
  );

  // ── 连接逻辑 ──────────────────────────────
  const { onConnect, onDisconnect, onErrorReset } =
    useProviderConnection(providerId);

  // ── 组装返回 ──────────────────────────────
  return {
    definition,
    value: config,
    onValueChange: (nextValue: Record<string, string>) =>
      setProviderConfig(providerId, nextValue),

    connection: {
      isConnected: status.isConnected,
      isLoading: status.isLoading,
      isError: status.isError,
      errorMessage: status.errorMessage,
      onConnect,
      onDisconnect,
      onErrorReset,
    },

    models: {
      available: models.available,
      enabled: models.enabled,
      onToggle: (model: string, enabled: boolean) => {
        // 1. 立即更新 Store（UI 即时响应）
        setModelEnabled(providerId, model, enabled);
        // 2. 计算新的 enabled 列表，同步到后端持久化
        const nextEnabled = { ...models.enabled, [model]: enabled };
        const enabledList = Object.entries(nextEnabled)
          .filter(([, v]) => v)
          .map(([k]) => k);
        updateEnabledModels(providerId, enabledList);
      },
      onToggleAll: (enabled: boolean) => {
        // 1. 立即更新 Store
        setAllModelsEnabled(providerId, enabled);
        // 2. 同步到后端
        const enabledList = enabled ? [...models.available] : [];
        updateEnabledModels(providerId, enabledList);
      },
    },
  };
};
