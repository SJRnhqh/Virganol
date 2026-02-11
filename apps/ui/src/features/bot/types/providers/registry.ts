// apps/ui/src/features/bot/types/providers/registry.ts
// 外部依赖
import type { ReactNode } from "react";

// 内部引用
import type { ProviderId } from "./config";

export interface ProviderRegistryEntry {
  id: ProviderId;
  icon: ReactNode;
}
