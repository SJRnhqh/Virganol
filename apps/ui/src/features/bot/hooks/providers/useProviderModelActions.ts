// apps/ui/src/features/bot/hooks/providers/useProviderModelActions.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import { updateEnabledModels } from "@/features/bot/api";
import { useProviderStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

const toEnabledList = (enabledMap: Record<string, boolean>) =>
  Object.entries(enabledMap)
    .filter(([, enabled]) => enabled)
    .map(([model]) => model);

export const useProviderModelActions = (providerId: ProviderId) => {
  const models = useProviderStore((state) => state.providerModels[providerId]);

  const setModelEnabled = useProviderStore((state) => state.setModelEnabled);
  const setAllModelsEnabled = useProviderStore(
    (state) => state.setAllModelsEnabled,
  );

  const onToggle = useCallback(
    async (model: string, enabled: boolean) => {
      // 用 getState 取最新快照，避免闭包旧值
      const current = useProviderStore.getState().providerModels[providerId];
      const previous = current.enabled[model] ?? true;
      const nextEnabled = { ...current.enabled, [model]: enabled };

      setModelEnabled(providerId, model, enabled);

      const ok = await updateEnabledModels(
        providerId,
        toEnabledList(nextEnabled),
      );
      if (!ok) {
        setModelEnabled(providerId, model, previous);
        console.error(`[React] rollback single model: ${providerId}/${model}`);
      }
    },
    [providerId, setModelEnabled],
  );

  const onToggleAll = useCallback(
    async (enabled: boolean) => {
      const current = useProviderStore.getState().providerModels[providerId];
      const previousMap = { ...current.enabled };

      setAllModelsEnabled(providerId, enabled);

      const enabledList = enabled ? [...current.available] : [];
      const ok = await updateEnabledModels(providerId, enabledList);

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
