// apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts
// 外部依赖
import { useCallback } from "react";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { useProviderCollectionStore } from "@/features/bot/store";
import { useProviderConnect, useProviderReset } from "./manager";

export const useProviderConnection = (providerId: ProviderId) => {
  // 连接操作（调用 manager 层）
  const handleConnect = useProviderConnect(providerId);

  // 重置操作（调用 manager 层）
  const handleReset = useProviderReset(providerId);

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
