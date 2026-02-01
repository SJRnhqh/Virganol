import { Ollama as OllamaIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { connectProvider } from "@/features/bot/api/providers";
import { useProviderStore } from "@/features/bot/store/providerStore";

export const OllamaProvider = () => {
  const config = useProviderStore((state) => state.providerConfig.ollama);
  const status = useProviderStore((state) => state.providerStatus.ollama);
  const models = useProviderStore((state) => state.providerModels.ollama);
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

  const handleConnect = async (config: Record<string, string>) => {
    setProviderStatus("ollama", {
      isLoading: true,
      isError: false,
      errorMessage: undefined,
    });

    const response = await connectProvider("ollama", config);

    if (response.success) {
      setAvailableModels("ollama", response.data?.available_models ?? []);
      setProviderStatus("ollama", {
        isConnected: true,
        isLoading: false,
        isError: false,
        errorMessage: undefined,
      });
    } else {
      setProviderStatus("ollama", {
        isConnected: false,
        isLoading: false,
        isError: true,
        errorMessage: response.error || "Connection failed",
      });
    }
  };

  const handleDisconnect = () => {
    setProviderStatus("ollama", {
      isConnected: false,
      isLoading: false,
      isError: false,
      errorMessage: undefined,
    });
  };

  const handleErrorReset = () => {
    resetProviderError("ollama");
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.ollama}
      icon={<OllamaIcon className="w-5 h-5" />}
      value={config}
      onValueChange={(nextValue) => setProviderConfig("ollama", nextValue)}
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
        setModelEnabled("ollama", model, enabled)
      }
      onToggleAllModels={(enabled) => setAllModelsEnabled("ollama", enabled)}
    />
  );
};
