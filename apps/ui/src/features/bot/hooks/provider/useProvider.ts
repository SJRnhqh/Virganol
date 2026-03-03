// apps/ui/src/features/bot/hooks/provider/useProvider.ts
// 内部引用
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { useProviderCollectionStore } from "@/features/bot/store";
import type { ProviderId } from "@/features/bot/types";

import { useProviderConnection } from "./useProviderConnection";
import { useProviderModelActions } from "./useProviderModelActions";

export const useProvider = (providerId: ProviderId) => {
  // ── 读取 Store 数据 ────────────────────────
  const definition = PROVIDER_DEFINITIONS[providerId];

  // 从新 store 读取单个 Provider 状态
  const providerState = useProviderCollectionStore(
    (state) => state.byId[providerId],
  );
  const setProviderForm = useProviderCollectionStore(
    (state) => state.setProviderForm,
  );

  // ── 连接逻辑 ──────────────────────────────
  const { onConnect, onDisconnect, onErrorReset } =
    useProviderConnection(providerId);

  const models = useProviderModelActions(providerId);

  // ── 组装返回 ──────────────────────────────
  return {
    definition,
    value: providerState.form,
    onValueChange: (nextValue: Record<string, string>) =>
      setProviderForm(providerId, nextValue),

    connection: {
      cardState: providerState.cardState,
      errorMessage: providerState.errorMessage,
      onConnect,
      onDisconnect,
      onErrorReset,
    },

    models,
  };
};
