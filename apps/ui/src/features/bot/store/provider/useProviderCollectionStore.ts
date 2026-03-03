// apps/ui/src/features/bot/store/provider/useProviderCollectionStore.ts
// 外部依赖
import { create } from "zustand";

// 内部引用
import {
  PROVIDER_CARD_STATES,
  PROVIDER_DEFINITIONS,
} from "@/features/bot/constants";
import type { ProviderCollectionState, ProviderId } from "@/features/bot/types";

const PROVIDER_IDS = Object.keys(PROVIDER_DEFINITIONS) as ProviderId[];

// 仅负责生成 Provider 集合初始快照（byId 路由映射）。
const createInitialById = (): ProviderCollectionState["byId"] => {
  const byId = {} as ProviderCollectionState["byId"];

  for (const providerId of PROVIDER_IDS) {
    byId[providerId] = {
      cardState: PROVIDER_CARD_STATES.UNSET,
      form: { ...PROVIDER_DEFINITIONS[providerId].defaultConfig },
      models: { available: [], enabled: {} },
      errorMessage: null,
    };
  }

  return byId;
};

export const useProviderCollectionStore = create<ProviderCollectionState>(
  (set) => ({
    // ── State ───────────────────────────────────
    byId: createInitialById(),

    // ── Actions ─────────────────────────────────
    // 所有 actions 遵循统一模式：定位到 byId[providerId]，更新其特定字段，保持其他字段不变。

    // 卡片状态
    setProviderCardState: (providerId, cardState) =>
      set((state) => ({
        byId: {
          ...state.byId,
          [providerId]: {
            ...state.byId[providerId],
            cardState,
          },
        },
      })),

    // 表单字段（合并更新）
    setProviderForm: (providerId, patch) =>
      set((state) => ({
        byId: {
          ...state.byId,
          [providerId]: {
            ...state.byId[providerId],
            form: {
              ...state.byId[providerId].form,
              ...patch,
            },
          },
        },
      })),

    // 模型状态（覆盖更新）
    setProviderModels: (providerId, models) =>
      set((state) => ({
        byId: {
          ...state.byId,
          [providerId]: {
            ...state.byId[providerId],
            models,
          },
        },
      })),

    // 模型状态（单个模型开关）
    setModelEnabled: (providerId, model, enabled) =>
      set((state) => ({
        byId: {
          ...state.byId,
          [providerId]: {
            ...state.byId[providerId],
            models: {
              ...state.byId[providerId].models,
              enabled: {
                ...state.byId[providerId].models.enabled,
                [model]: enabled,
              },
            },
          },
        },
      })),

    // 模型状态（全部模型开关）
    setAllModelsEnabled: (providerId, enabled) =>
      set((state) => {
        const availableModels = state.byId[providerId].models.available;
        const nextEnabled: Record<string, boolean> = {};
        for (const model of availableModels) {
          nextEnabled[model] = enabled;
        }
        return {
          byId: {
            ...state.byId,
            [providerId]: {
              ...state.byId[providerId],
              models: {
                ...state.byId[providerId].models,
                enabled: nextEnabled,
              },
            },
          },
        };
      }),

    // 错误信息（设置）
    setProviderError: (providerId, message) =>
      set((state) => ({
        byId: {
          ...state.byId,
          [providerId]: {
            ...state.byId[providerId],
            errorMessage: message,
          },
        },
      })),

    // 错误信息（清空）
    clearProviderError: (providerId) =>
      set((state) => ({
        byId: {
          ...state.byId,
          [providerId]: {
            ...state.byId[providerId],
            errorMessage: null,
          },
        },
      })),
  }),
);
