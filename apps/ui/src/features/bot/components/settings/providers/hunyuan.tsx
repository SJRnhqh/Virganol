// apps/ui/src/features/bot/components/settings/providers/hunyuan.tsx
// 外部依赖
import { Hunyuan as HunyuanIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const hunyuanProvider = {
  id: "hunyuan",
  icon: <HunyuanIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
