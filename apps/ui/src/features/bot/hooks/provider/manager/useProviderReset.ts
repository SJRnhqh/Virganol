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
 *
 * TODO(post-0.0.1): 添加焦点管理
 * - Reset 成功后，焦点移到 Connect 按钮（引导用户重新连接）
 * - Reset 失败后，焦点保持在 Reset 按钮（方便重试）
 * - 需要通过 ref 或回调函数通知组件层进行焦点管理
 * 当前 0.0.1 版本不处理焦点，后续版本完善可访问性支持
 */
export const useProviderReset = (providerId: ProviderId) => {
  return useCallback(async () => {
    const response = await resetProvider(providerId);
    if (response.success) {
      const store = useProviderCollectionStore.getState();
      store.updateProviderBatch(providerId, {
        form: PROVIDER_INITIAL_FORMS[providerId],
        cardState: PROVIDER_CARD_STATES.UNSET,
        models: { available: [], enabled: {} },
        errorMessage: null,
      });
    } else {
      // 卡片内反馈：回写 FAILED + errorMessage，避免前端停留在 CONNECTED 导致与后端真实状态脱节。
      // 跨卡片的全局 toast/notification 仍待 Phase 6.2 统一错误显示方案。
      useProviderCollectionStore.getState().updateProviderBatch(providerId, {
        cardState: PROVIDER_CARD_STATES.FAILED,
        errorMessage: response.error ?? "Reset failed",
      });
      console.error(
        `[React] reset_provider ${providerId} failed:`,
        response.error,
      );
    }
  }, [providerId]);
};
