import { useState } from "react";
import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";

export const DeepseekProvider = () => {
  const [isConnected, setIsConnected] = useState(false);

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.deepseek}
      icon={<DeepSeekIcon className="w-5 h-5" />}
      onDisconnect={handleDisconnect}
      isConnected={isConnected}
    />
  );
};
