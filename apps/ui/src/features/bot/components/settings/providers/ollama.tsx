import { Ollama as OllamaIcon } from "@lobehub/icons";
import type { ProviderRegistryEntry } from "./types";

export const ollamaProvider = {
  id: "ollama",
  icon: <OllamaIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
