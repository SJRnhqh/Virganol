// apps/ui/src/features/bot/hooks/provider/useProvider.ts
// 外部依赖
import { useShallow } from "zustand/react/shallow";

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
  const { cardState, storedForm, errorMessage } = useProviderCollectionStore(
    useShallow((s) => ({
      cardState: s.byId[providerId].cardState,
      storedForm: s.byId[providerId].form,
      errorMessage: s.byId[providerId].errorMessage,
    })),
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
    cardState,
    provider: {
      id: providerId,
      name: PROVIDER_NAMES[providerId],
      icon: PROVIDER_ICONS[providerId],
    },
    form: {
      fields: PROVIDER_FORM_FIELDS[providerId],
      formData: storedForm,
      onUpdate: (patch: Partial<ProviderFormData>) =>
        useProviderCollectionStore
          .getState()
          .setProviderForm(providerId, patch),
    },
    errorMessage,
    connection: {
      onConnect,
      onReset: handleReset,
      onRetry,
    },
  };
};
