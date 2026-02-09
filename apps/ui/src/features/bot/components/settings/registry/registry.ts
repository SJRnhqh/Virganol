// apps/ui/src/features/bot/components/settings/registry/registry.ts

import { deepseekProvider } from "../providers/deepseek";
import { ollamaProvider } from "../providers/ollama";
import { type ProviderRegistryEntry } from "./entry";

export const PROVIDER_REGISTRY = [
  ollamaProvider,
  deepseekProvider,
] satisfies ProviderRegistryEntry[];
