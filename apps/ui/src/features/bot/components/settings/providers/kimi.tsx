// apps/ui/src/features/bot/components/settings/providers/kimi.tsx
// 外部依赖
import { Kimi as KimiIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const kimiProvider = {
  id: "kimi",
  icon: <KimiIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
