// apps/ui/src/features/bot/hooks/providers/useProviderConnection.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import { connectProvider } from "@/features/bot/api/providers";
import { useProviderStore } from "@/features/bot/store/providers";
import type { ProviderId } from "@/features/bot/types/providers";

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

      const response = await connectProvider(providerId, nextConfig);

      if (response.success) {
        setAvailableModels(providerId, response.data?.available_models ?? []);
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

