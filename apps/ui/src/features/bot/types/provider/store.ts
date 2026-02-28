// apps/ui/src/features/bot/types/provider/store.ts
// 内部引用
import type { ProviderId } from "./config";

// ── 单个 Provider 的数据结构 ─────────────────

export interface ProviderStatus {
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface ProviderModels {
  available: string[];
  enabled: Record<string, boolean>;
}

// ── Store 完整形状（数据 + Actions）──────────

export interface ProviderState {
  providerConfig: Record<ProviderId, Record<string, string>>;
  providerStatus: Record<ProviderId, ProviderStatus>;
  providerModels: Record<ProviderId, ProviderModels>;

  setProviderConfig: (
    providerId: ProviderId,
    config: Record<string, string>,
  ) => void;
  setProviderStatus: (
    providerId: ProviderId,
    patch: Partial<ProviderStatus>,
  ) => void;
  resetProviderError: (providerId: ProviderId) => void;
  setAvailableModels: (providerId: ProviderId, models: string[]) => void;
  setModelEnabled: (
    providerId: ProviderId,
    model: string,
    enabled: boolean,
  ) => void;
  setAllModelsEnabled: (providerId: ProviderId, enabled: boolean) => void;
}
