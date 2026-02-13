// apps/ui/src/features/bot/hooks/providers/useProvider.ts
// 内部引用
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { updateEnabledModels } from "@/features/bot/api";
import { useProviderStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

import { useProviderConnection } from "./useProviderConnection";

export const useProvider = (providerId: ProviderId) => {
  // ── 读取 Store 数据 ────────────────────────
  const definition = PROVIDER_DEFINITIONS[providerId];
  const config = useProviderStore((state) => state.providerConfig[providerId]);
  const status = useProviderStore((state) => state.providerStatus[providerId]);
  const models = useProviderStore((state) => state.providerModels[providerId]);

  // ── Actions ────────────────────────────────
  const setProviderConfig = useProviderStore(
    (state) => state.setProviderConfig,
  );
  const setModelEnabled = useProviderStore((state) => state.setModelEnabled);
  const setAllModelsEnabled = useProviderStore(
    (state) => state.setAllModelsEnabled,
  );

  // ── 连接逻辑 ──────────────────────────────
  const { onConnect, onDisconnect, onErrorReset } =
    useProviderConnection(providerId);

  // ── 组装返回 ──────────────────────────────
  return {
    definition,
    value: config,
    onValueChange: (nextValue: Record<string, string>) =>
      setProviderConfig(providerId, nextValue),

    connection: {
      isConnected: status.isConnected,
      isLoading: status.isLoading,
      isError: status.isError,
      errorMessage: status.errorMessage,
      onConnect,
      onDisconnect,
      onErrorReset,
    },

    models: {
      available: models.available,
      enabled: models.enabled,
      onToggle: async (model: string, enabled: boolean) => {
        // 回滚快照：后端持久化失败时恢复单个模型开关
        const previous = models.enabled[model] ?? true;

        // 乐观更新：先更新 UI，保证交互即时反馈
        setModelEnabled(providerId, model, enabled);

        // 计算最新启用模型列表并同步到后端
        const nextEnabled = { ...models.enabled, [model]: enabled };
        const enabledList = Object.entries(nextEnabled)
          .filter(([, v]) => v)
          .map(([k]) => k);

        const ok = await updateEnabledModels(providerId, enabledList);
        if (!ok) {
          // 持久化失败：回滚 UI 到操作前状态
          setModelEnabled(providerId, model, previous);
          console.error(
            `[React] rollback single model: ${providerId}/${model}`,
          );
        }
      },

      onToggleAll: async (enabled: boolean) => {
        // 回滚快照：记录当前每个模型状态，失败时整组恢复
        const previousMap = { ...models.enabled };

        // 乐观更新：批量切换前端状态
        setAllModelsEnabled(providerId, enabled);

        // 同步批量结果到后端持久化
        const enabledList = enabled ? [...models.available] : [];
        const ok = await updateEnabledModels(providerId, enabledList);
        if (!ok) {
          // 持久化失败：逐个模型回滚到旧状态
          models.available.forEach((model) => {
            setModelEnabled(providerId, model, previousMap[model] ?? true);
          });
          console.error(`[React] rollback all models: ${providerId}`);
        }
      },
    },
  };
};
