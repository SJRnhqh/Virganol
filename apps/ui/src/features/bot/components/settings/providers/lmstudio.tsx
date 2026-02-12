// apps/ui/src/features/bot/components/settings/providers/lmstudio.tsx
// 外部依赖
import { LmStudio as LmStudioIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const lmstudioProvider = {
  id: "lmstudio",
  icon: <LmStudioIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
