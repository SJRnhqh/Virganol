// apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import {
  PROVIDER_CARD_STATES,
  PROVIDER_INITIAL_FORMS,
} from "@/features/bot/constants";
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
      });

      // 2. 调用后端 API
      const response = await connectAndSaveProvider({
        providerId,
        key: formData.apiKey ?? "",
        url: formData.apiURL,
      });

      // 3. 根据结果批量更新状态
      if (response.success) {
        store.updateProviderBatch(providerId, {
          form: { apiKey: "" },
          cardState: PROVIDER_CARD_STATES.CONNECTED,
          models: {
            available: response.available_models,
            // TODO: 契约语义边界 — HealthCheckResponse 同时承载健康检查结果与模型状态，
            //   需明确纯健康检查结果与模型推送之间的职责边界，待 Phase 6.1 拆分 ConnectResponse。
            enabled: Object.fromEntries(
              response.available_models.map((model) => [model, false]),
            ),
          },
        });
      } else {
        store.updateProviderBatch(providerId, {
          cardState: PROVIDER_CARD_STATES.FAILED,
          errorMessage: response.error ?? "Connection failed",
        });
      }
    },
    [providerId],
  );

  // 重置操作（删除后端配置 + 重置前端状态）
  const handleReset = useCallback(async () => {
    const success = await resetProvider(providerId);
    if (success) {
      const store = useProviderCollectionStore.getState();
      store.updateProviderBatch(providerId, {
        form: PROVIDER_INITIAL_FORMS[providerId],
        cardState: PROVIDER_CARD_STATES.UNSET,
        models: { available: [], enabled: {} },
        errorMessage: null,
      });
    } else {
      // TODO: 前端错误处理与用户反馈 — reset 失败时需显示错误提示，
      //   待 Phase 6.2 实现结构化错误响应与错误显示方案
      console.error(`[React] reset_provider ${providerId} failed`);
    }
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
