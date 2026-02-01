import { useState } from "react";
import { Ollama as OllamaIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { connectProvider } from "@/features/bot/api/providers";

export const OllamaProvider = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleConnect = async (config: Record<string, string>) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage(undefined);

    const response = await connectProvider("ollama", config);

    if (response.success) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
      setIsError(true);
      setErrorMessage(response.error || "Connection failed");
    }
    setIsLoading(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleErrorReset = () => {
    setIsError(false);
    setErrorMessage(undefined);
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.ollama}
      icon={<OllamaIcon className="w-5 h-5" />}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
      isConnected={isConnected}
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      onErrorReset={handleErrorReset}
    />
  );
};
