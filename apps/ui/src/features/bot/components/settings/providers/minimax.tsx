// apps/ui/src/features/bot/components/settings/providers/minimax.tsx
// 外部依赖
import { Minimax as MinimaxIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const minimaxProvider = {
  id: "minimax",
  icon: <MinimaxIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
