// apps/ui/src/features/bot/components/settings/providers/qwen.tsx
// 外部依赖
import { Qwen as QwenIcon } from "@lobehub/icons";

// 内部引用
import type { ProviderRegistryEntry } from "@/features/bot/types";

export const qwenProvider = {
  id: "qwen",
  icon: <QwenIcon className="w-5 h-5" />,
} satisfies ProviderRegistryEntry;
