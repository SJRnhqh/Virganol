// apps/ui/src/features/bot/components/settings/providers/ollama.tsx
// 外部依赖
import { Ollama as OllamaIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types/providers";

export const ollamaProvider = {
  id: "ollama",
  icon: <OllamaIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
