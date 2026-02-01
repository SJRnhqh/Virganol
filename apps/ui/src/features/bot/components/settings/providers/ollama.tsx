import { Ollama as OllamaIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { connectProvider } from "@/features/bot/api/providers";
import { useBotStore } from "@/store";

export const OllamaProvider = () => {
  const config = useBotStore((state) => state.providerConfig.ollama);
  const status = useBotStore((state) => state.providerStatus.ollama);
  const setProviderConfig = useBotStore((state) => state.setProviderConfig);
  const setProviderStatus = useBotStore((state) => state.setProviderStatus);
  const resetProviderError = useBotStore((state) => state.resetProviderError);

  const handleConnect = async (config: Record<string, string>) => {
    setProviderStatus("ollama", {
      isLoading: true,
      isError: false,
      errorMessage: undefined,
    });

    const response = await connectProvider("ollama", config);

    if (response.success) {
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
    setProviderStatus("ollama", { isConnected: false });
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
    />
  );
};
