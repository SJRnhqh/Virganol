// apps/ui/src/features/bot/components/settings/registry/entry.ts
// 外部依赖
import type { ReactNode } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types/llmProviders";

export interface ProviderRegistryEntry {
  id: ProviderId;
  icon: ReactNode;
}
