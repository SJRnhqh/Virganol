// apps/ui/src/features/bot/hooks/provider/useProvider.ts
// 外部依赖
import { useShallow } from "zustand/react/shallow";

// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { PROVIDER_FORM_FIELDS, PROVIDER_NAMES } from "@/features/bot/constants";
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
  const { onConnect, onRetry, onReset } = useProviderConnection(providerId);

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
      onRetry,
      onReset,
    },
  };
};
