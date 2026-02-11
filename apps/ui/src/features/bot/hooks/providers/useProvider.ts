// apps/ui/src/features/bot/hooks/providers/useProvider.ts
// 内部引用
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants/providers";
import { useProviderStore } from "@/features/bot/store/providers";
import type { ProviderId } from "@/features/bot/types/providers";
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
      onToggle: (model: string, enabled: boolean) =>
        setModelEnabled(providerId, model, enabled),
      onToggleAll: (enabled: boolean) =>
        setAllModelsEnabled(providerId, enabled),
    },
  };
};
