import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { connectProvider } from "@/features/bot/api/providers";
import { useProviderStore } from "@/features/bot/store/providerStore";

export const DeepseekProvider = () => {
  const config = useProviderStore((state) => state.providerConfig.deepseek);
  const status = useProviderStore((state) => state.providerStatus.deepseek);
  const models = useProviderStore((state) => state.providerModels.deepseek);
  const setProviderConfig = useProviderStore(
    (state) => state.setProviderConfig,
  );
  const setProviderStatus = useProviderStore(
    (state) => state.setProviderStatus,
  );
  const setModelEnabled = useProviderStore((state) => state.setModelEnabled);
  const setAllModelsEnabled = useProviderStore(
    (state) => state.setAllModelsEnabled,
  );
  const resetProviderError = useProviderStore(
    (state) => state.resetProviderError,
  );
  const setAvailableModels = useProviderStore(
    (state) => state.setAvailableModels,
  );

  const handleConnect = async (config: Record<string, string>) => {
    setProviderStatus("deepseek", {
      isLoading: true,
      isError: false,
      errorMessage: undefined,
    });

    const response = await connectProvider("deepseek", config);

    if (response.success) {
      setAvailableModels("deepseek", response.data?.available_models ?? []);
      setProviderStatus("deepseek", {
        isConnected: true,
        isLoading: false,
        isError: false,
        errorMessage: undefined,
      });
    } else {
      setProviderStatus("deepseek", {
        isConnected: false,
        isLoading: false,
        isError: true,
        errorMessage: response.error || "Connection failed",
      });
    }
  };

  const handleDisconnect = () => {
    setProviderStatus("deepseek", {
      isConnected: false,
      isLoading: false,
      isError: false,
      errorMessage: undefined,
    });
  };

  const handleErrorReset = () => {
    resetProviderError("deepseek");
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.deepseek}
      icon={<DeepSeekIcon className="w-5 h-5" />}
      value={config}
      onValueChange={(nextValue) => setProviderConfig("deepseek", nextValue)}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      isConnected={status.isConnected}
      isLoading={status.isLoading}
      isError={status.isError}
      errorMessage={status.errorMessage}
      onErrorReset={handleErrorReset}
      availableModels={models.available}
      enabledModels={models.enabled}
      onModelToggle={(model, enabled) =>
        setModelEnabled("deepseek", model, enabled)
      }
      onToggleAllModels={(enabled) => setAllModelsEnabled("deepseek", enabled)}
    />
  );
};
