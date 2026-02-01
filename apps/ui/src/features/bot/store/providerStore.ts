import { create } from "zustand";
import {
  PROVIDER_DEFINITIONS,
  type ProviderId,
} from "@/features/bot/types/llmProviders";

interface ProviderStatus {
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

interface ProviderModels {
  available: string[];
  enabled: Record<string, boolean>;
}

type ProviderConfigState = Record<ProviderId, Record<string, string>>;
type ProviderStatusState = Record<ProviderId, ProviderStatus>;
type ProviderModelsState = Record<ProviderId, ProviderModels>;

const PROVIDER_IDS = Object.keys(PROVIDER_DEFINITIONS) as ProviderId[];

type ProviderSlice = "providerConfig" | "providerStatus" | "providerModels";

const createDefaultProviderConfig = (
  providerId: ProviderId,
): Record<string, string> => ({
  ...PROVIDER_DEFINITIONS[providerId].defaultConfig,
});

const createDefaultProviderStatus = (): ProviderStatus => ({
  isConnected: false,
  isLoading: false,
  isError: false,
  errorMessage: undefined,
});

const createDefaultProviderModels = (): ProviderModels => ({
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

const createProviderState = () => ({
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

const withProviderConfig = (
  state: ProviderState,
  providerId: ProviderId,
  value: Record<string, string>,
) => withProviderSlice(state, "providerConfig", providerId, value);

const withProviderStatus = (
  state: ProviderState,
  providerId: ProviderId,
  value: ProviderStatus,
) => withProviderSlice(state, "providerStatus", providerId, value);

const withProviderModels = (
  state: ProviderState,
  providerId: ProviderId,
  value: ProviderModels,
) => withProviderSlice(state, "providerModels", providerId, value);

interface ProviderState {
  providerConfig: ProviderConfigState;
  providerStatus: ProviderStatusState;
  providerModels: ProviderModelsState;

  setProviderConfig: (
    providerId: ProviderId,
    config: Record<string, string>,
  ) => void;
  updateProviderConfigField: (
    providerId: ProviderId,
    key: string,
    value: string,
  ) => void;
  resetProviderConfig: (providerId: ProviderId) => void;
  setProviderStatus: (
    providerId: ProviderId,
    patch: Partial<ProviderStatus>,
  ) => void;
  resetProviderStatus: (providerId: ProviderId) => void;
  resetProviderError: (providerId: ProviderId) => void;
  setAvailableModels: (providerId: ProviderId, models: string[]) => void;
  setModelEnabled: (
    providerId: ProviderId,
    model: string,
    enabled: boolean,
  ) => void;
  setAllModelsEnabled: (providerId: ProviderId, enabled: boolean) => void;
  resetProvider: (providerId: ProviderId) => void;
}

export const useProviderStore = create<ProviderState>((set) => ({
  ...createProviderState(),

  setProviderConfig: (providerId, config) =>
    set((state) => withProviderConfig(state, providerId, { ...config })),

  updateProviderConfigField: (providerId, key, value) =>
    set((state) =>
      withProviderConfig(state, providerId, {
        ...state.providerConfig[providerId],
        [key]: value,
      }),
    ),

  resetProviderConfig: (providerId) =>
    set((state) =>
      withProviderConfig(
        state,
        providerId,
        createDefaultProviderConfig(providerId),
      ),
    ),

  setProviderStatus: (providerId, patch) =>
    set((state) =>
      withProviderStatus(state, providerId, {
        ...state.providerStatus[providerId],
        ...patch,
      }),
    ),

  resetProviderStatus: (providerId) =>
    set((state) =>
      withProviderStatus(state, providerId, createDefaultProviderStatus()),
    ),

  resetProviderError: (providerId) =>
    set((state) =>
      withProviderStatus(state, providerId, {
        ...state.providerStatus[providerId],
        isError: false,
        errorMessage: undefined,
      }),
    ),

  setAvailableModels: (providerId, models) =>
    set((state) => {
      const previousEnabled = state.providerModels[providerId].enabled;
      const nextEnabled: Record<string, boolean> = {};

      models.forEach((model) => {
        nextEnabled[model] = previousEnabled[model] ?? true;
      });

      return {
        ...withProviderModels(state, providerId, {
          available: models,
          enabled: nextEnabled,
        }),
      };
    }),

  setModelEnabled: (providerId, model, enabled) =>
    set((state) =>
      withProviderModels(state, providerId, {
        ...state.providerModels[providerId],
        enabled: {
          ...state.providerModels[providerId].enabled,
          [model]: enabled,
        },
      }),
    ),

  setAllModelsEnabled: (providerId, enabled) =>
    set((state) => {
      const availableModels = state.providerModels[providerId].available;
      const nextEnabled: Record<string, boolean> = {};

      availableModels.forEach((model) => {
        nextEnabled[model] = enabled;
      });

      return {
        ...withProviderModels(state, providerId, {
          ...state.providerModels[providerId],
          enabled: nextEnabled,
        }),
      };
    }),

  resetProvider: (providerId) =>
    set((state) => ({
      ...withProviderConfig(
        state,
        providerId,
        createDefaultProviderConfig(providerId),
      ),
      ...withProviderStatus(state, providerId, createDefaultProviderStatus()),
      ...withProviderModels(state, providerId, createDefaultProviderModels()),
    })),
}));
