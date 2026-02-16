// apps/ui/src/features/bot/components/settings/providers/doubao.tsx
// 外部依赖
import { Doubao as DoubaoIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const doubaoProvider = {
  id: "doubao",
  icon: <DoubaoIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
