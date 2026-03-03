// apps/ui/src/features/bot/hooks/provider/useProviderModelActions.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import { updateEnabledModels } from "@/features/bot/api";
import { useProviderCollectionStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

// 将模型启用映射转换为启用模型列表（用于后端 API）
const toEnabledList = (enabledMap: Record<string, boolean>) =>
  Object.entries(enabledMap)
    .filter(([, enabled]) => enabled)
    .map(([model]) => model);

export const useProviderModelActions = (providerId: ProviderId) => {
  // 读取当前 Provider 的模型状态
  const models = useProviderCollectionStore(
    (state) => state.byId[providerId].models,
  );

  // 获取 store actions
  const setModelEnabled = useProviderCollectionStore(
    (state) => state.setModelEnabled,
  );
  const setAllModelsEnabled = useProviderCollectionStore(
    (state) => state.setAllModelsEnabled,
  );

  // 单个模型开关（乐观更新 + 失败回滚）
  const onToggle = useCallback(
    async (model: string, enabled: boolean) => {
      // 1. 保存旧值用于回滚
      const current =
        useProviderCollectionStore.getState().byId[providerId].models;
      const previous = current.enabled[model] ?? true;
      const nextEnabled = { ...current.enabled, [model]: enabled };

      // 2. 乐观更新前端状态
      setModelEnabled(providerId, model, enabled);

      // 3. 调用后端 API 持久化
      const ok = await updateEnabledModels(
        providerId,
        toEnabledList(nextEnabled),
      );

      // 4. 失败时回滚
      if (!ok) {
        setModelEnabled(providerId, model, previous);
        console.error(`[React] rollback single model: ${providerId}/${model}`);
      }
    },
    [providerId, setModelEnabled],
  );

  // 全部模型开关（乐观更新 + 失败回滚）
  const onToggleAll = useCallback(
    async (enabled: boolean) => {
      // 1. 保存旧值用于回滚
      const current =
        useProviderCollectionStore.getState().byId[providerId].models;
      const previousMap = { ...current.enabled };

      // 2. 乐观更新前端状态
      setAllModelsEnabled(providerId, enabled);

      // 3. 调用后端 API 持久化
      const enabledList = enabled ? [...current.available] : [];
      const ok = await updateEnabledModels(providerId, enabledList);

      // 4. 失败时回滚
      if (!ok) {
        current.available.forEach((model) => {
          setModelEnabled(providerId, model, previousMap[model] ?? true);
        });
        console.error(`[React] rollback all models: ${providerId}`);
      }
    },
    [providerId, setAllModelsEnabled, setModelEnabled],
  );

  return {
    available: models.available,
    enabled: models.enabled,
    onToggle,
    onToggleAll,
  };
};
