// apps/ui/src/features/bot/components/settings/providers/deepseek.tsx
// 外部依赖
import { DeepSeek as DeepSeekIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types/providers";

export const deepseekProvider = {
  id: "deepseek",
  icon: <DeepSeekIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
