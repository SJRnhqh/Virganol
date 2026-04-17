// apps/ui/src/features/bot/hooks/provider/manager/useToggleModels.ts
// 外部依赖
import { useCallback, useRef } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { useProviderCollectionStore } from "@/features/bot/store";
import { updateEnabledModels } from "@/features/bot/services";

// 将启用状态 map 转换为启用模型列表（用于后端 API）
const toEnabledList = (enabledMap: Record<string, boolean>) =>
  Object.entries(enabledMap)
    .filter(([, enabled]) => enabled)
    .map(([model]) => model);

/**
 * Provider 模型 toggle 钩子
 *
 * 提供单个模型和全部模型的 toggle 方法，共享互斥锁防止并发冲突
 * 采用乐观更新策略，失败时自动回滚
 */
export const useToggleModels = (providerId: ProviderId) => {
  // 并发防护：同一时刻只允许一个模型操作在飞行中
  const pendingRef = useRef(false);

  // 单个模型 toggle（乐观更新 + 失败回滚）
  const toggleSingle = useCallback(
    async (model: string) => {
      if (pendingRef.current) return;
      pendingRef.current = true;

      try {
        // getState() 绕过订阅拿最新快照，避免闭包过期
        const store = useProviderCollectionStore.getState();
        const current = store.byId[providerId].models;

        // 计算 toggle 后的状态
        const previous = current.enabled[model] ?? true;

        // 构造更新后的完整 enabled map，用于传给后端
        const nextEnabled = { ...current.enabled, [model]: !previous };

        // 乐观更新
        store.setModelEnabled(providerId, model, !previous);

        // 调用后端 API
        const response = await updateEnabledModels({
          providerId,
          enabledModels: toEnabledList(nextEnabled),
        });

        // 失败回滚
        if (!response.success) {
          useProviderCollectionStore
            .getState()
            .setModelEnabled(providerId, model, previous);
          console.error(
            `[React] rollback single model: ${providerId}/${model}`,
            response.error,
          );
        }
      } finally {
        pendingRef.current = false;
      }
    },
    [providerId],
  );

  // 全部模型 toggle（乐观更新 + 失败回滚）
  const toggleAll = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;

    try {
      const store = useProviderCollectionStore.getState();
      const current = store.byId[providerId].models;

      // 记录回滚值
      const previousMap = { ...current.enabled };

      // 计算 toggle 后的状态（全选 → 全不选，未全选 → 全选）
      const allSelected = current.available.every(
        (model) => current.enabled[model],
      );
      const allEnabled = !allSelected;

      // 乐观更新
      store.setAllModelsEnabled(providerId, allEnabled);

      // 调用后端 API
      const enabledList = allEnabled ? [...current.available] : [];
      const response = await updateEnabledModels({
        providerId,
        enabledModels: enabledList,
      });

      // 失败回滚
      if (!response.success) {
        useProviderCollectionStore.getState().setProviderModels(providerId, {
          available: current.available,
          enabled: previousMap,
        });
        console.error(
          `[React] rollback all models: ${providerId}`,
          response.error,
        );
      }
    } finally {
      pendingRef.current = false;
    }
  }, [providerId]);

  return {
    toggleSingle,
    toggleAll,
  };
};
