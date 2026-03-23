// apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { PROVIDER_CARD_STATES, PROVIDER_INITIAL_FORMS } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import { resetProvider, connectAndSaveProvider } from "@/features/bot/services";

export const useProviderConnection = (providerId: ProviderId) => {
  // 连接操作（调用后端 API + 批量更新前端状态）
  const handleConnect = useCallback(
    async (formData: ProviderFormData) => {
      const store = useProviderCollectionStore.getState();

      // 1. 设置为 pending 状态
      store.updateProviderBatch(providerId, {
        cardState: PROVIDER_CARD_STATES.PENDING,
        errorMessage: null,
      });

      // 2. 从前端 config 字段中提取 url 和 key
      const url = formData.apiURL ?? "";
      const key = formData.apiKey ?? "";

      // 3. 调用后端 API
      const response = await connectAndSaveProvider({
        providerId,
        key,
        ...(url.trim().length > 0 ? { url } : {}),
      });

      // 4. 根据结果批量更新状态
      if (response.success) {
        store.updateProviderBatch(providerId, {
          form: { apiKey: "" },
          cardState: PROVIDER_CARD_STATES.CONNECTED,
          models: {
            available: response.available_models,
            enabled: Object.fromEntries(
              response.available_models.map((model) => [model, true]),
            ),
          },
          errorMessage: null,
        });
      } else {
        store.updateProviderBatch(providerId, {
          cardState: PROVIDER_CARD_STATES.FAILED,
          errorMessage: response.error || "Connection failed",
        });
      }
    },
    [providerId],
  );

  // 重置操作（重置表单 + 删除后端配置 + 重置前端状态）
  const handleReset = useCallback(async () => {
    const store = useProviderCollectionStore.getState();
    store.setProviderForm(providerId, PROVIDER_INITIAL_FORMS[providerId]);
    await resetProvider(providerId);
    store.updateProviderBatch(providerId, {
      cardState: PROVIDER_CARD_STATES.UNSET,
      models: { available: [], enabled: {} },
      errorMessage: null,
    });
  }, [providerId]);

  // 重试操作（清空错误 + 重新连接）
  const handleRetry = useCallback(
    async (formData: ProviderFormData) => {
      useProviderCollectionStore.getState().clearProviderError(providerId);
      await handleConnect(formData);
    },
    [providerId, handleConnect],
  );

  return {
    onConnect: handleConnect,
    onReset: handleReset,
    onRetry: handleRetry,
  };
};
