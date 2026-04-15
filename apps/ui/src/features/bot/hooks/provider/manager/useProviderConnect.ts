// apps/ui/src/features/bot/hooks/provider/manager/useProviderConnect.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import { connectAndSaveProvider } from "@/features/bot/services";

export const useProviderConnect = (providerId: ProviderId) => {
  return useCallback(
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
    },
    [providerId],
  );
};
