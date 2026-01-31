import { useState } from "react";
import { Ollama as OllamaIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { connectProvider } from "@/features/bot/api/providers";

export const OllamaProvider = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (config: Record<string, string>) => {
    setIsLoading(true);
    const response = await connectProvider("ollama", config);

    if (response.success) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
    setIsLoading(false);
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.ollama}
      icon={<OllamaIcon className="w-5 h-5" />}
      onConnect={handleConnect}
      isConnected={isConnected}
      isLoading={isLoading}
    />
  );
};
