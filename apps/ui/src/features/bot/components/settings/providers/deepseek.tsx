import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
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

  const handleDisconnect = () => {
    setProviderStatus("deepseek", {
      isConnected: false,
      isLoading: false,
      isError: false,
      errorMessage: undefined,
    });
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.deepseek}
      icon={<DeepSeekIcon className="w-5 h-5" />}
      value={config}
      onValueChange={(nextValue) => setProviderConfig("deepseek", nextValue)}
      onDisconnect={handleDisconnect}
      isConnected={status.isConnected}
      availableModels={models.available}
      enabledModels={models.enabled}
      onModelToggle={(model, enabled) =>
        setModelEnabled("deepseek", model, enabled)
      }
      onToggleAllModels={(enabled) => setAllModelsEnabled("deepseek", enabled)}
    />
  );
};
