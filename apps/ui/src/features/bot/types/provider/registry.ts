// apps/ui/src/features/bot/types/provider/registry.ts
// 外部依赖
import type { ReactNode } from "react";

// 内部引用
import type { ProviderId } from "./common";

export interface ProviderRegistryEntry {
  id: ProviderId;
  icon: ReactNode;
}
