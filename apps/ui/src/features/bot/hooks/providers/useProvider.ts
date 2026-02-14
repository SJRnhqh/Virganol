// apps/ui/src/features/bot/hooks/providers/useProvider.ts
// 内部引用
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { useProviderStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

import { useProviderConnection } from "./useProviderConnection";
import { useProviderModelActions } from "./useProviderModelActions";

export const useProvider = (providerId: ProviderId) => {
  // ── 读取 Store 数据 ────────────────────────
  const definition = PROVIDER_DEFINITIONS[providerId];
  const config = useProviderStore((state) => state.providerConfig[providerId]);
  const status = useProviderStore((state) => state.providerStatus[providerId]);

  // ── Actions ────────────────────────────────
  const setProviderConfig = useProviderStore(
    (state) => state.setProviderConfig,
  );

  // ── 连接逻辑 ──────────────────────────────
  const { onConnect, onDisconnect, onErrorReset } =
    useProviderConnection(providerId);

  const models = useProviderModelActions(providerId);

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

    models,
  };
};
