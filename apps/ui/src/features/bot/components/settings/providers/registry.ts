import type { ProviderRegistryEntry } from "./types";
import { deepseekProvider } from "./deepseek";
import { ollamaProvider } from "./ollama";

export const PROVIDER_REGISTRY = [
  ollamaProvider,
  deepseekProvider,
] satisfies ProviderRegistryEntry[];
