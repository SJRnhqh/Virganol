// apps/ui/src/features/bot/hooks/providers/useProviderConnection.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import { connectAndSaveProvider } from "@/features/bot/api";
import { useProviderStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

export const useProviderConnection = (providerId: ProviderId) => {
  const setProviderStatus = useProviderStore(
    (state) => state.setProviderStatus,
  );
  const setAvailableModels = useProviderStore(
    (state) => state.setAvailableModels,
  );
  const resetProviderError = useProviderStore(
    (state) => state.resetProviderError,
  );

  const handleConnect = useCallback(
    async (nextConfig: Record<string, string>) => {
      setProviderStatus(providerId, {
        isLoading: true,
        isError: false,
        errorMessage: undefined,
      });

      // 从前端 config 字段中提取 url 和 key
      const url = nextConfig.apiURL ?? "";
      const key = nextConfig.apiKey ?? "";

      const response = await connectAndSaveProvider(providerId, url, key);

      if (response.success) {
        setAvailableModels(providerId, response.available_models);
        setProviderStatus(providerId, {
          isConnected: true,
          isLoading: false,
          isError: false,
          errorMessage: undefined,
        });
      } else {
        setProviderStatus(providerId, {
          isConnected: false,
          isLoading: false,
          isError: true,
          errorMessage: response.error || "Connection failed",
        });
      }
    },
    [providerId, setAvailableModels, setProviderStatus],
  );

  const handleDisconnect = useCallback(() => {
    setProviderStatus(providerId, {
      isConnected: false,
      isLoading: false,
      isError: false,
      errorMessage: undefined,
    });
  }, [providerId, setProviderStatus]);

  return {
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onErrorReset: () => resetProviderError(providerId),
  };
};