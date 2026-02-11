// apps/ui/src/features/bot/constants/providers/registry.ts
// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";
import {
  ollamaProvider,
  deepseekProvider,
} from "@/features/bot/components/settings/providers";

export const PROVIDER_REGISTRY = [
  ollamaProvider,
  deepseekProvider,
] satisfies ProviderRegistryEntry[];
