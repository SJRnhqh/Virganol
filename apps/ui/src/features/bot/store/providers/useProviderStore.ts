// apps/ui/src/features/bot/store/providers/useProviderStore.ts
import { create } from "zustand";
import {
  createProviderState,
  type ProviderState,
  withProviderConfig,
  withProviderModels,
  withProviderStatus,
} from "../providerStore";

export const useProviderStore = create<ProviderState>((set) => ({
  ...createProviderState(),

  setProviderConfig: (providerId, config) =>
    set((state) => withProviderConfig(state, providerId, { ...config })),

  setProviderStatus: (providerId, patch) =>
    set((state) =>
      withProviderStatus(state, providerId, {
        ...state.providerStatus[providerId],
        ...patch,
      }),
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
}));
