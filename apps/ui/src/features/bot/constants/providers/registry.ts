// apps/ui/src/features/bot/constants/providers/registry.ts
// 内部引用
import type { ProviderRegistryEntry } from "../../types/providers";
import {
  ollamaProvider,
  deepseekProvider,
} from "../../components/settings/providers";

export const PROVIDER_REGISTRY = [
  ollamaProvider,
  deepseekProvider,
] satisfies ProviderRegistryEntry[];
