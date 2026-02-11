import { useCallback } from "react";
import { connectProvider } from "@/features/bot/api/providers";
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants/providers";
import { useProviderStore } from "@/features/bot/store/providers";
import type { ProviderId } from "@/features/bot/types/providers";

export const useProvider = (providerId: ProviderId) => {
  const definition = PROVIDER_DEFINITIONS[providerId];
  const config = useProviderStore((state) => state.providerConfig[providerId]);
  const status = useProviderStore((state) => state.providerStatus[providerId]);
  const models = useProviderStore((state) => state.providerModels[providerId]);
  const setProviderConfig = useProviderStore(
    (state) => state.setProviderConfig,
  );
  const setProviderStatus = useProviderStore(
    (state) => state.setProviderStatus,
  );
  const resetProviderError = useProviderStore(
    (state) => state.resetProviderError,
  );
  const setAvailableModels = useProviderStore(
    (state) => state.setAvailableModels,
  );
  const setModelEnabled = useProviderStore((state) => state.setModelEnabled);
  const setAllModelsEnabled = useProviderStore(
    (state) => state.setAllModelsEnabled,
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
    definition,
    value: config,
    onValueChange: (nextValue: Record<string, string>) =>
      setProviderConfig(providerId, nextValue),
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    isConnected: status.isConnected,
    isLoading: status.isLoading,
    isError: status.isError,
    errorMessage: status.errorMessage,
    onErrorReset: () => resetProviderError(providerId),
    availableModels: models.available,
    enabledModels: models.enabled,
    onModelToggle: (model: string, enabled: boolean) =>
      setModelEnabled(providerId, model, enabled),
    onToggleAllModels: (enabled: boolean) =>
      setAllModelsEnabled(providerId, enabled),
  };
};
