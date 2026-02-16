// apps/ui/src/features/bot/components/settings/providers/wenxin.tsx
// 外部依赖
import { Wenxin as WenxinIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const wenxinProvider = {
  id: "wenxin",
  icon: <WenxinIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
