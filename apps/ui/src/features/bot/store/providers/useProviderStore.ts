// apps/ui/src/features/bot/store/providers/useProviderStore.ts
// 外部依赖
import { create } from "zustand";

// 内部引用
import type { ProviderState } from "@/features/bot/types/providers";
import { createProviderState } from "./init";
import { withSlice } from "./update";

export const useProviderStore = create<ProviderState>((set) => ({
  ...createProviderState(),

  // ── Config ──────────────────────────────────
  setProviderConfig: (providerId, config) =>
    set((state) => withSlice(state, "providerConfig", providerId, { ...config })),

  // ── Status ──────────────────────────────────
  setProviderStatus: (providerId, patch) =>
    set((state) =>
      withSlice(state, "providerStatus", providerId, {
        ...state.providerStatus[providerId],
        ...patch,
      }),
    ),

  resetProviderError: (providerId) =>
    set((state) =>
      withSlice(state, "providerStatus", providerId, {
        ...state.providerStatus[providerId],
        isError: false,
        errorMessage: undefined,
      }),
    ),

  // ── Models ──────────────────────────────────
  setAvailableModels: (providerId, models) =>
    set((state) => {
      const previousEnabled = state.providerModels[providerId].enabled;
      const nextEnabled: Record<string, boolean> = {};

      models.forEach((model) => {
        nextEnabled[model] = previousEnabled[model] ?? true;
      });

      return withSlice(state, "providerModels", providerId, {
        available: models,
        enabled: nextEnabled,
      });
    }),

  setModelEnabled: (providerId, model, enabled) =>
    set((state) =>
      withSlice(state, "providerModels", providerId, {
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

      return withSlice(state, "providerModels", providerId, {
        ...state.providerModels[providerId],
        enabled: nextEnabled,
      });
    }),
}));
