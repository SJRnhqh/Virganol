// apps/ui/src/features/bot/store/providers/init.ts
// 内部引用
import type { ProviderId, ProviderState } from "@/features/bot/types";
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";

const PROVIDER_IDS = Object.keys(PROVIDER_DEFINITIONS) as ProviderId[];

const mapProviders = <T>(fn: (id: ProviderId) => T) =>
  Object.fromEntries(PROVIDER_IDS.map((id) => [id, fn(id)])) as Record<
    ProviderId,
    T
  >;

export const createProviderState = () => ({
  providerConfig: mapProviders((id) => ({
    ...PROVIDER_DEFINITIONS[id].defaultConfig,
  })) as ProviderState["providerConfig"],
  providerStatus: mapProviders(() => ({
    isConnected: false,
    isLoading: false,
    isError: false,
    errorMessage: undefined,
  })) as ProviderState["providerStatus"],
  providerModels: mapProviders(() => ({
    available: [],
    enabled: {},
  })) as ProviderState["providerModels"],
});
