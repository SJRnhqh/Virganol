// apps/ui/src/features/bot/store/providerStore.ts
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants/providers";
import type { ProviderId } from "@/features/bot/types/providers";

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

export type ProviderConfigState = Record<ProviderId, Record<string, string>>;
export type ProviderStatusState = Record<ProviderId, ProviderStatus>;
export type ProviderModelsState = Record<ProviderId, ProviderModels>;

const PROVIDER_IDS = Object.keys(PROVIDER_DEFINITIONS) as ProviderId[];

type ProviderSlice = "providerConfig" | "providerStatus" | "providerModels";

export const createDefaultProviderConfig = (
  providerId: ProviderId,
): Record<string, string> => ({
  ...PROVIDER_DEFINITIONS[providerId].defaultConfig,
});

export const createDefaultProviderStatus = (): ProviderStatus => ({
  isConnected: false,
  isLoading: false,
  isError: false,
  errorMessage: undefined,
});

export const createDefaultProviderModels = (): ProviderModels => ({
  available: [],
  enabled: {},
});

const createDefaultProviderConfigState = (): ProviderConfigState =>
  Object.fromEntries(
    PROVIDER_IDS.map((providerId) => [
      providerId,
      createDefaultProviderConfig(providerId),
    ]),
  ) as ProviderConfigState;

const createDefaultProviderStatusState = (): ProviderStatusState =>
  Object.fromEntries(
    PROVIDER_IDS.map((providerId) => [
      providerId,
      createDefaultProviderStatus(),
    ]),
  ) as ProviderStatusState;

const createDefaultProviderModelsState = (): ProviderModelsState =>
  Object.fromEntries(
    PROVIDER_IDS.map((providerId) => [
      providerId,
      createDefaultProviderModels(),
    ]),
  ) as ProviderModelsState;

export const createProviderState = () => ({
  providerConfig: createDefaultProviderConfigState(),
  providerStatus: createDefaultProviderStatusState(),
  providerModels: createDefaultProviderModelsState(),
});

const withProviderSlice = <T extends ProviderSlice>(
  state: ProviderState,
  slice: T,
  providerId: ProviderId,
  value: ProviderState[T][ProviderId],
): Pick<ProviderState, T> =>
  ({
    [slice]: { ...state[slice], [providerId]: value },
  }) as Pick<ProviderState, T>;

export const withProviderConfig = (
  state: ProviderState,
  providerId: ProviderId,
  value: Record<string, string>,
) => withProviderSlice(state, "providerConfig", providerId, value);

export const withProviderStatus = (
  state: ProviderState,
  providerId: ProviderId,
  value: ProviderStatus,
) => withProviderSlice(state, "providerStatus", providerId, value);

export const withProviderModels = (
  state: ProviderState,
  providerId: ProviderId,
  value: ProviderModels,
) => withProviderSlice(state, "providerModels", providerId, value);

export interface ProviderState {
  providerConfig: ProviderConfigState;
  providerStatus: ProviderStatusState;
  providerModels: ProviderModelsState;

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
