// apps/ui/src/features/bot/hooks/provider/manager/useProviderReset.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId } from "@/features/bot/types";
import {
  PROVIDER_CARD_STATES,
  PROVIDER_INITIAL_FORMS,
} from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import { resetProvider } from "@/features/bot/services";

/**
 * Provider 配置重置钩子
 *
 * 调用后端 API 删除持久化配置，成功后重置前端状态
 */
export const useProviderReset = (providerId: ProviderId) => {
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

  return handleReset;
};
