// apps/ui/src/features/bot/store/provider/useProviderCollectionStore.ts
// 外部依赖
import { create } from "zustand";

// 内部引用
import {
  PROVIDER_IDS,
  PROVIDER_CARD_STATES,
  PROVIDER_INITIAL_FORMS,
} from "@/features/bot/constants";
import type { ProviderCollectionState } from "@/features/bot/types";

// 单个 Provider 的公共初始状态（除 form 外）
const COMMON_INITIAL_STATE = {
  cardState: PROVIDER_CARD_STATES.UNSET,
  models: { available: [], enabled: {} },
  errorMessage: null,
};

// 仅负责生成 Provider 集合初始快照（byId 路由映射）。
const createInitialById = (): ProviderCollectionState["byId"] => {
  return PROVIDER_IDS.reduce((acc, providerId) => {
    acc[providerId] = {
      ...COMMON_INITIAL_STATE,
      form: { ...PROVIDER_INITIAL_FORMS[providerId] },
    };
    return acc;
  }, {} as ProviderCollectionState["byId"]);
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
