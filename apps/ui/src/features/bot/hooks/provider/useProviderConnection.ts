// apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts
// TODO: 重构连接逻辑钩子
// 问题：1) 重复订阅 store actions 导致不必要重渲染；2) useCallback 依赖数组冗余；3) 业务逻辑与 handlers 重复（模型映射构造）；4) 缺少统一错误处理；5) 需要根据接口契约重新设计返回值结构。
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import { resetProvider, connectAndSaveProvider } from "@/features/bot/api";

export const useProviderConnection = (providerId: ProviderId) => {
  // 获取 store actions
  const setProviderCardState = useProviderCollectionStore(
    (state) => state.setProviderCardState,
  );
  const setProviderModels = useProviderCollectionStore(
    (state) => state.setProviderModels,
  );
  const setProviderError = useProviderCollectionStore(
    (state) => state.setProviderError,
  );
  const clearProviderError = useProviderCollectionStore(
    (state) => state.clearProviderError,
  );

  // 连接操作（调用后端 API + 更新前端状态）
  const handleConnect = useCallback(
    async (nextConfig: Record<string, string>) => {
      // 1. 设置为 pending 状态
      setProviderCardState(providerId, PROVIDER_CARD_STATES.PENDING);
      clearProviderError(providerId);

      // 2. 从前端 config 字段中提取 url 和 key
      const url = nextConfig.apiURL ?? "";
      const key = nextConfig.apiKey ?? "";

      // 3. 调用后端 API
      const response = await connectAndSaveProvider({
        providerId,
        key,
        ...(url.trim().length > 0 ? { url } : {}),
      });

      // 4. 根据结果更新状态
      if (response.success) {
        setProviderCardState(providerId, PROVIDER_CARD_STATES.CONNECTED);
        setProviderModels(providerId, {
          available: response.available_models,
          enabled: Object.fromEntries(
            response.available_models.map((model) => [model, true]),
          ),
        });
      } else {
        setProviderCardState(providerId, PROVIDER_CARD_STATES.FAILED);
        setProviderError(providerId, response.error || "Connection failed");
      }
    },
    [
      providerId,
      setProviderCardState,
      setProviderModels,
      setProviderError,
      clearProviderError,
    ],
  );

  // 断开连接操作（删除后端配置 + 重置前端状态）
  const handleDisconnect = useCallback(async () => {
    // 1. 删除后端持久化配置
    await resetProvider(providerId);

    // 2. 重置前端状态
    setProviderCardState(providerId, PROVIDER_CARD_STATES.UNSET);
    setProviderModels(providerId, { available: [], enabled: {} });
    clearProviderError(providerId);
  }, [providerId, setProviderCardState, setProviderModels, clearProviderError]);

  // 错误重置操作（仅清空错误信息）
  const handleErrorReset = useCallback(() => {
    clearProviderError(providerId);
  }, [providerId, clearProviderError]);

  return {
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onErrorReset: handleErrorReset,
  };
};
