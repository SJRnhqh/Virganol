// apps/ui/src/features/bot/hooks/provider/useProviderModelList.ts
// 外部依赖
import { useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProviderCollectionStore } from "@/features/bot/store";
import { updateEnabledModels } from "@/features/bot/services";

// 将启用状态 map 转换为启用模型列表（用于后端 API）
const toEnabledList = (enabledMap: Record<string, boolean>) =>
  Object.entries(enabledMap)
    .filter(([, enabled]) => enabled)
    .map(([model]) => model);

export const useProviderModelList = (providerId: ProviderId) => {
  // 订阅模型数据（useShallow 浅比较，available/enabled 同时变更只触发一次渲染）
  const { available, enabled } = useProviderCollectionStore(
    useShallow((s) => s.byId[providerId].models),
  );

  // 组装组件所需的模型列表（含选中状态）
  const modelItems = available.map((model) => ({
    name: model,
    checked: enabled[model],
  }));

  // 派生全选状态（every 短路，遇第一个未选中立即返回）
  const allSelected = available.every((model) => enabled[model]);

  // 并发防护：同一时刻只允许一个模型操作在飞行中
  const pendingRef = useRef(false);

  // 单个模型开关（乐观更新 + 失败回滚；调用时读取最新状态避免闭包过期）
  const handleToggleModel = useCallback(
    async (model: string) => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      try {
        // getState() 绕过订阅拿最新快照，避免闭包过期
        const store = useProviderCollectionStore.getState();
        const current = store.byId[providerId].models;
        // 记录回滚值；key 不存在时默认 true
        const previous = current.enabled[model] ?? true;
        // 构造 toggle 后的完整 enabled map，用于传给后端
        const nextEnabled = { ...current.enabled, [model]: !previous };

        store.setModelEnabled(providerId, model, !previous);

        const ok = await updateEnabledModels(
          providerId,
          toEnabledList(nextEnabled),
        );
        if (!ok) {
          useProviderCollectionStore
            .getState()
            .setModelEnabled(providerId, model, previous);
          console.error(
            `[React] rollback single model: ${providerId}/${model}`,
          );
        }
      } finally {
        pendingRef.current = false;
      }
    },
    [providerId],
  );

  // 全部模型开关（乐观更新 + 失败回滚；next 来自渲染时 allSelected 快照）
  const handleToggleAllModels = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    try {
      const store = useProviderCollectionStore.getState();
      const current = store.byId[providerId].models;
      const previousMap = { ...current.enabled };
      const next = !allSelected;

      store.setAllModelsEnabled(providerId, next);

      const enabledList = next ? [...current.available] : [];
      const ok = await updateEnabledModels(providerId, enabledList);
      if (!ok) {
        useProviderCollectionStore.getState().setProviderModels(providerId, {
          available: current.available,
          enabled: previousMap,
        });
        console.error(`[React] rollback all models: ${providerId}`);
      }
    } finally {
      pendingRef.current = false;
    }
  }, [providerId, allSelected]);

  return {
    modelItems,
    allSelected,
    onToggleModel: handleToggleModel,
    onToggleAllModels: handleToggleAllModels,
  };
};
