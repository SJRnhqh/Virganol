import type { ReactNode } from "react";
import type { ProviderId } from "@/features/bot/types/llmProviders";

export interface ProviderRegistryEntry {
  id: ProviderId;
  icon: ReactNode;
}
