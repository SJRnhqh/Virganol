// apps/ui/src/features/bot/store/provider/useProviderCollectionStore.ts
// 外部依赖
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 内部引用
import type { ProviderCollectionState } from "@/features/bot/types";
import {
  PROVIDER_IDS,
  PROVIDER_CARD_STATES,
  PROVIDER_INITIAL_FORMS,
} from "@/features/bot/constants";

// 单个 Provider 的公共初始状态（除 form 外）
const COMMON_INITIAL_STATE = {
  cardState: PROVIDER_CARD_STATES.UNSET,
  errorMessage: null,
};

// 仅负责生成 Provider 集合初始快照（byId 路由映射）。
const createInitialById = (): ProviderCollectionState["byId"] => {
  return PROVIDER_IDS.reduce(
    (acc, providerId) => {
      acc[providerId] = {
        ...COMMON_INITIAL_STATE,
        models: { available: [], enabled: {} },
        form: { ...PROVIDER_INITIAL_FORMS[providerId] },
      };
      return acc;
    },
    {} as ProviderCollectionState["byId"],
  );
};

export const useProviderCollectionStore = create<ProviderCollectionState>()(
  immer((set) => ({
    // ── State ───────────────────────────────────
    byId: createInitialById(),

    // ── Actions ─────────────────────────────────
    // 使用 immer 中间件，所有 actions 可直接修改 state，immer 自动处理不可变更新。

    // 卡片状态
    setProviderCardState: (providerId, cardState) =>
      set((state) => {
        state.byId[providerId].cardState = cardState;
      }),

    // 表单字段（合并更新）
    setProviderForm: (providerId, patch) =>
      set((state) => {
        Object.assign(state.byId[providerId].form, patch);
      }),

    // 模型状态（覆盖更新）
    setProviderModels: (providerId, models) =>
      set((state) => {
        state.byId[providerId].models = models;
      }),

    // 模型状态（单个模型开关）
    setModelEnabled: (providerId, model, enabled) =>
      set((state) => {
        state.byId[providerId].models.enabled[model] = enabled;
      }),

    // 模型状态（全部模型开关）
    setAllModelsEnabled: (providerId, enabled) =>
      set((state) => {
        const { available } = state.byId[providerId].models;
        state.byId[providerId].models.enabled = Object.fromEntries(
          available.map((model) => [model, enabled]),
        );
      }),

    // 错误信息（设置）
    setProviderError: (providerId, message) =>
      set((state) => {
        state.byId[providerId].errorMessage = message;
      }),

    // 错误信息（清空）
    clearProviderError: (providerId) =>
      set((state) => {
        state.byId[providerId].errorMessage = null;
      }),

    // 批量更新（减少重渲染）
    updateProviderBatch: (providerId, updates) =>
      set((state) => {
        const provider = state.byId[providerId];
        if (updates.cardState !== undefined) {
          provider.cardState = updates.cardState;
        }
        if (updates.form !== undefined) {
          Object.assign(provider.form, updates.form);
        }
        if (updates.models !== undefined) {
          provider.models = updates.models;
        }
        if (updates.errorMessage !== undefined) {
          provider.errorMessage = updates.errorMessage;
        }
      }),
  })),
);
