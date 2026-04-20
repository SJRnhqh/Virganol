// apps/ui/src/features/bot/hooks/provider/manager/useProviderConnect.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import { connectAndSaveProvider } from "@/features/bot/services";

// TODO(post-0.0.1): 添加焦点管理
// - Connect 成功后，焦点移到第一个模型或 Reset 按钮
// - Connect 失败后，焦点保持在 Connect 按钮（方便重试）
// - 需要通过 ref 或回调函数通知组件层进行焦点管理
// 当前 0.0.1 版本不处理焦点，后续版本完善可访问性支持

export const useProviderConnect = (providerId: ProviderId) => {
  return useCallback(
    async (formData: ProviderFormData) => {
      const store = useProviderCollectionStore.getState();

      // Guard：如果已有请求在执行中，直接返回（store 层 provider 级别锁）
      if (store.byId[providerId].isPending) return;

      try {
        // 1. 设置为 pending 状态并加锁
        store.updateProviderBatch(providerId, {
          cardState: PROVIDER_CARD_STATES.PENDING,
          isPending: true,
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
            isPending: false,
          });
        } else {
          store.updateProviderBatch(providerId, {
            cardState: PROVIDER_CARD_STATES.FAILED,
            errorMessage: response.error ?? "Connection failed",
            isPending: false,
          });
        }
      } catch (error) {
        // 4. 异常处理：确保解锁
        store.updateProviderBatch(providerId, {
          cardState: PROVIDER_CARD_STATES.FAILED,
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
          isPending: false,
        });
      }
    },
    [providerId],
  );
};
