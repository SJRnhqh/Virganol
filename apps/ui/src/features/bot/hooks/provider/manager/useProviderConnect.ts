// apps/ui/src/features/bot/hooks/provider/manager/useProviderConnect.ts
// 外部依赖
import { useCallback, useRef } from "react";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import { connectAndSaveProvider } from "@/features/bot/services";

export const useProviderConnect = (providerId: ProviderId) => {
  // 并发防护：防止快速重复点击导致多个 connect 请求同时执行
  const pendingRef = useRef(false);

  return useCallback(
    async (formData: ProviderFormData) => {
      // Guard：如果已有请求在执行中，直接返回
      if (pendingRef.current) return;
      pendingRef.current = true;

      try {
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
              available: response.availableModels,
              enabled: Object.fromEntries(
                response.availableModels.map((model) => [
                  model,
                  response.enabledModels.includes(model),
                ]),
              ),
            },
          });
        } else {
          store.updateProviderBatch(providerId, {
            cardState: PROVIDER_CARD_STATES.FAILED,
            errorMessage: response.error ?? "Connection failed",
          });
        }
      } finally {
        // 确保无论成功或失败都解锁
        pendingRef.current = false;
      }
    },
    [providerId],
  );
};
