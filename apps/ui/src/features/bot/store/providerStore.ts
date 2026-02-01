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

const DEFAULT_PROVIDER_CONFIG: ProviderConfigState = {
  ollama: { ...PROVIDER_DEFINITIONS.ollama.defaultConfig },
  deepseek: { ...PROVIDER_DEFINITIONS.deepseek.defaultConfig },
};

const DEFAULT_PROVIDER_STATUS: ProviderStatusState = {
  ollama: {
    isConnected: false,
    isLoading: false,
    isError: false,
    errorMessage: undefined,
  },
  deepseek: {
    isConnected: false,
    isLoading: false,
    isError: false,
    errorMessage: undefined,
  },
};

const DEFAULT_PROVIDER_MODELS: ProviderModelsState = {
  ollama: {
    available: [],
    enabled: {},
  },
  deepseek: {
    available: [],
    enabled: {},
  },
};

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
  providerConfig: {
    ollama: { ...DEFAULT_PROVIDER_CONFIG.ollama },
    deepseek: { ...DEFAULT_PROVIDER_CONFIG.deepseek },
  },
  providerStatus: {
    ollama: { ...DEFAULT_PROVIDER_STATUS.ollama },
    deepseek: { ...DEFAULT_PROVIDER_STATUS.deepseek },
  },
  providerModels: {
    ollama: { ...DEFAULT_PROVIDER_MODELS.ollama },
    deepseek: { ...DEFAULT_PROVIDER_MODELS.deepseek },
  },

  setProviderConfig: (providerId, config) =>
    set((state) => ({
      providerConfig: {
        ...state.providerConfig,
        [providerId]: { ...config },
      },
    })),

  updateProviderConfigField: (providerId, key, value) =>
    set((state) => ({
      providerConfig: {
        ...state.providerConfig,
        [providerId]: {
          ...state.providerConfig[providerId],
          [key]: value,
        },
      },
    })),

  resetProviderConfig: (providerId) =>
    set((state) => ({
      providerConfig: {
        ...state.providerConfig,
        [providerId]: { ...DEFAULT_PROVIDER_CONFIG[providerId] },
      },
    })),

  setProviderStatus: (providerId, patch) =>
    set((state) => ({
      providerStatus: {
        ...state.providerStatus,
        [providerId]: { ...state.providerStatus[providerId], ...patch },
      },
    })),

  resetProviderStatus: (providerId) =>
    set((state) => ({
      providerStatus: {
        ...state.providerStatus,
        [providerId]: { ...DEFAULT_PROVIDER_STATUS[providerId] },
      },
    })),

  resetProviderError: (providerId) =>
    set((state) => ({
      providerStatus: {
        ...state.providerStatus,
        [providerId]: {
          ...state.providerStatus[providerId],
          isError: false,
          errorMessage: undefined,
        },
      },
    })),

  setAvailableModels: (providerId, models) =>
    set((state) => {
      const previousEnabled = state.providerModels[providerId].enabled;
      const nextEnabled: Record<string, boolean> = {};

      models.forEach((model) => {
        nextEnabled[model] = previousEnabled[model] ?? true;
      });

      return {
        providerModels: {
          ...state.providerModels,
          [providerId]: {
            available: models,
            enabled: nextEnabled,
          },
        },
      };
    }),

  setModelEnabled: (providerId, model, enabled) =>
    set((state) => ({
      providerModels: {
        ...state.providerModels,
        [providerId]: {
          ...state.providerModels[providerId],
          enabled: {
            ...state.providerModels[providerId].enabled,
            [model]: enabled,
          },
        },
      },
    })),

  setAllModelsEnabled: (providerId, enabled) =>
    set((state) => {
      const availableModels = state.providerModels[providerId].available;
      const nextEnabled: Record<string, boolean> = {};

      availableModels.forEach((model) => {
        nextEnabled[model] = enabled;
      });

      return {
        providerModels: {
          ...state.providerModels,
          [providerId]: {
            ...state.providerModels[providerId],
            enabled: nextEnabled,
          },
        },
      };
    }),

  resetProvider: (providerId) =>
    set((state) => ({
      providerConfig: {
        ...state.providerConfig,
        [providerId]: { ...DEFAULT_PROVIDER_CONFIG[providerId] },
      },
      providerStatus: {
        ...state.providerStatus,
        [providerId]: { ...DEFAULT_PROVIDER_STATUS[providerId] },
      },
      providerModels: {
        ...state.providerModels,
        [providerId]: { ...DEFAULT_PROVIDER_MODELS[providerId] },
      },
    })),
}));
