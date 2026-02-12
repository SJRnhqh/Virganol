// apps/ui/src/features/bot/components/settings/providers/zhipu.tsx
// 外部依赖
import { Zhipu as ZhipuIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const zhipuProvider = {
  id: "zhipu",
  icon: <ZhipuIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
