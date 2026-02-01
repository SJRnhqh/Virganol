import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { useBotStore } from "@/store";

export const DeepseekProvider = () => {
  const config = useBotStore((state) => state.providerConfig.deepseek);
  const status = useBotStore((state) => state.providerStatus.deepseek);
  const setProviderConfig = useBotStore((state) => state.setProviderConfig);
  const setProviderStatus = useBotStore((state) => state.setProviderStatus);

  const handleDisconnect = () => {
    setProviderStatus("deepseek", { isConnected: false });
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.deepseek}
      icon={<DeepSeekIcon className="w-5 h-5" />}
      value={config}
      onValueChange={(nextValue) => setProviderConfig("deepseek", nextValue)}
      onDisconnect={handleDisconnect}
      isConnected={status.isConnected}
    />
  );
};
