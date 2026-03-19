// apps/ui/src/features/bot/hooks/provider/useProvider.ts
// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import {
  PROVIDER_FORM_FIELDS,
  PROVIDER_NAMES,
  PROVIDER_INITIAL_FORMS,
} from "@/features/bot/constants";
import { PROVIDER_ICONS } from "@/features/bot/icons";
import { useProviderCollectionStore } from "@/features/bot/store";
import { useProviderConnection } from "./useProviderConnection";

export const useProvider = (providerId: ProviderId) => {
  // ── 读取 Store 数据 ────────────────────────
  const providerState = useProviderCollectionStore(
    (state) => state.byId[providerId],
  );

  // ── 连接逻辑 ──────────────────────────────
  const { onConnect, onDisconnect, onRetry } =
    useProviderConnection(providerId);

  const handleReset = () => {
    // 1. 重置表单数据到初始值
    useProviderCollectionStore
      .getState()
      .setProviderForm(providerId, PROVIDER_INITIAL_FORMS[providerId]);

    // 2. 调用后端清理 + 重置前端状态
    void onDisconnect();
  };

  // ── 组装返回 ──────────────────────────────
  return {
    cardState: providerState.cardState,
    provider: {
      id: providerId,
      name: PROVIDER_NAMES[providerId],
      icon: PROVIDER_ICONS[providerId],
    },
    form: {
      fields: PROVIDER_FORM_FIELDS[providerId],
      formData: providerState.form,
      onUpdate: (patch: Partial<ProviderFormData>) =>
        useProviderCollectionStore
          .getState()
          .setProviderForm(providerId, patch),
    },
    errorMessage: providerState.errorMessage,
    connection: {
      onConnect,
      onReset: handleReset,
      onRetry,
    },
  };
};
