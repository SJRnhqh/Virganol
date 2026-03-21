// apps/ui/src/features/bot/hooks/provider/useProviderModelList.ts
// TODO: 当前为内联合并简化版本（原 useProviderModelActions 已合并至此）；
// 乐观更新的并发安全性（快速连续点击场景）与 allSelected 闭包时序问题仍待评估，后续统一重构。
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProviderCollectionStore } from "@/features/bot/store";
import { updateEnabledModels } from "@/features/bot/services";

// 将启用状态 map 转换为启用模型列表（用于后端 API）
const toEnabledList = (enabledMap: Record<string, boolean>) =>
  Object.entries(enabledMap)
    .filter(([, enabled]) => enabled)
    .map(([model]) => model);

export const useProviderModelList = (
  providerId: ProviderId,
) => {
  // 订阅可用模型列表与启用状态（独立 selector，互不干扰重渲染）
  const available = useProviderCollectionStore(
    (state) => state.byId[providerId].models.available,
  );
  const enabled = useProviderCollectionStore(
    (state) => state.byId[providerId].models.enabled,
  );

  // 组装组件所需的模型列表（含选中状态）
  const modelItems = available.map((model) => ({
    name: model,
    checked: enabled[model],
  }));

  // 派生全选状态
  const enabledCount = modelItems.reduce(
    (count, model) => count + (model.checked ? 1 : 0),
    0,
  );
  const allSelected = enabledCount === modelItems.length;

  // 单个模型开关（乐观更新 + 失败回滚；调用时读取最新状态避免闭包过期）
  const handleToggleModel = useCallback(
    async (model: string) => {
      const current = useProviderCollectionStore.getState().byId[providerId].models;
      const previous = current.enabled[model] ?? true;
      const nextEnabled = { ...current.enabled, [model]: !previous };

      useProviderCollectionStore.getState().setModelEnabled(providerId, model, !previous);

      const ok = await updateEnabledModels(providerId, toEnabledList(nextEnabled));
      if (!ok) {
        useProviderCollectionStore.getState().setModelEnabled(providerId, model, previous);
        console.error(`[React] rollback single model: ${providerId}/${model}`);
      }
    },
    [providerId],
  );

  // 全部模型开关（乐观更新 + 失败回滚；next 来自渲染时 allSelected 快照）
  const handleToggleAllModels = useCallback(
    async () => {
      const current = useProviderCollectionStore.getState().byId[providerId].models;
      const previousMap = { ...current.enabled };
      const next = !allSelected;

      useProviderCollectionStore.getState().setAllModelsEnabled(providerId, next);

      const enabledList = next ? [...current.available] : [];
      const ok = await updateEnabledModels(providerId, enabledList);
      if (!ok) {
        current.available.forEach((model) => {
          useProviderCollectionStore.getState().setModelEnabled(providerId, model, previousMap[model] ?? true);
        });
        console.error(`[React] rollback all models: ${providerId}`);
      }
    },
    [providerId, allSelected],
  );

  return {
    modelItems,
    allSelected,
    onToggleModel: handleToggleModel,
    onToggleAllModels: handleToggleAllModels,
  };
};
