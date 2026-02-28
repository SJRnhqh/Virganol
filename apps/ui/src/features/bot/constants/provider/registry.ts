// apps/ui/src/features/bot/constants/provider/registry.ts
// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";
import {
  ollamaProvider,
  // lmstudioProvider,
  deepseekProvider,
  // qwenProvider,
  // doubaoProvider,
  // minimaxProvider,
  // zhipuProvider,
  // kimiProvider,
  // wenxinProvider,
  // hunyuanProvider,
} from "@/features/bot/components/settings/providers";

export const PROVIDER_REGISTRY = [
  ollamaProvider,
  // lmstudioProvider,
  deepseekProvider,
  // qwenProvider,
  // doubaoProvider,
  // minimaxProvider,
  // zhipuProvider,
  // kimiProvider,
  // wenxinProvider,
  // hunyuanProvider,
] satisfies ProviderRegistryEntry[];
