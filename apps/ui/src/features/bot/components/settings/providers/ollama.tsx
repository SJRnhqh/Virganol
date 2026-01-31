import { Ollama as OllamaIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";
import { connectProvider } from "@/features/bot/api/providers";

export const OllamaProvider = () => {
  const handleConnect = async (config: Record<string, string>) => {
    const response = await connectProvider("ollama", config);

    if (response.success) {
      console.log("Connected to Ollama:", response.data);
    } else {
      console.error("Failed to connect:", response.error);
    }
  };

  return (
    <BaseProvider
      definition={PROVIDER_DEFINITIONS.ollama}
      icon={<OllamaIcon className="w-5 h-5" />}
      onConnect={handleConnect}
    />
  );
};
