import { Ollama as OllamaIcon } from "@lobehub/icons";
import { BaseProvider } from "../../base/BaseProvider";
import { PROVIDER_DEFINITIONS } from "@/features/bot/types/llmProviders";

export const OllamaProvider = () => (
  <BaseProvider
    definition={PROVIDER_DEFINITIONS.ollama}
    icon={<OllamaIcon className="w-5 h-5" />}
  />
);
