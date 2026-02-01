import { create } from "zustand";
import { PROVIDER_DEFINITIONS, type ProviderId } from "@/features/bot/types/llmProviders";

interface ProviderStatus {
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

type ProviderConfigState = Record<ProviderId, Record<string, string>>;
type ProviderStatusState = Record<ProviderId, ProviderStatus>;

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

interface BotState {
  providerConfig: ProviderConfigState;
  providerStatus: ProviderStatusState;

  setProviderConfig: (providerId: ProviderId, config: Record<string, string>) => void;
  updateProviderConfigField: (
    providerId: ProviderId,
    key: string,
    value: string,
  ) => void;
  resetProviderConfig: (providerId: ProviderId) => void;
  setProviderStatus: (providerId: ProviderId, patch: Partial<ProviderStatus>) => void;
  resetProviderStatus: (providerId: ProviderId) => void;
  resetProviderError: (providerId: ProviderId) => void;
  resetProvider: (providerId: ProviderId) => void;
}

export const useBotStore = create<BotState>((set) => ({
  providerConfig: {
    ollama: { ...DEFAULT_PROVIDER_CONFIG.ollama },
    deepseek: { ...DEFAULT_PROVIDER_CONFIG.deepseek },
  },
  providerStatus: {
    ollama: { ...DEFAULT_PROVIDER_STATUS.ollama },
    deepseek: { ...DEFAULT_PROVIDER_STATUS.deepseek },
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
    })),
}));
