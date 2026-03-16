// apps/ui/src/features/bot/hooks/provider/useProvider.ts
// 内部引用
import type { ProviderId, ProviderFormData } from "@/features/bot/types";
import { PROVIDER_DEFINITIONS, PROVIDER_NAMES } from "@/features/bot/constants";
import { PROVIDER_ICONS } from "@/features/bot/icons";
import { useProviderCollectionStore } from "@/features/bot/store";
import { useProviderModelActions } from "./useProviderModelActions";
import { useProviderConnection } from "./useProviderConnection";

export const useProvider = (providerId: ProviderId) => {
  // ── 读取 Store 数据 ────────────────────────
  // TODO: 评估 definition 的实际消费字段，考虑按需传递而非整体传递；当前 PROVIDER_DEFINITIONS 已被拆分为多个 constants，后续需根据组件层实际使用情况优化传值策略。
  const definition = PROVIDER_DEFINITIONS[providerId];

  // 从新 store 读取单个 Provider 状态
  const providerState = useProviderCollectionStore(
    (state) => state.byId[providerId],
  );

  // ── 连接逻辑 ──────────────────────────────
  const { onConnect, onDisconnect, onErrorReset } =
    useProviderConnection(providerId);

  const models = useProviderModelActions(providerId);

  // ── 组装返回 ──────────────────────────────
  // TODO: 重新设计返回值结构，确保与 types/constants 的语义一致性；当前 definition/value/connection/models 的分组逻辑需要根据组件层实际消费模式优化，避免语义混乱和冗余嵌套。
  return {
    providerId,
    meta: {
      name: PROVIDER_NAMES[providerId],
      icon: PROVIDER_ICONS[providerId],
    },
    formData: providerState.form,
    updateFormData: (nextFormData: ProviderFormData) =>
      useProviderCollectionStore
        .getState()
        .setProviderForm(providerId, nextFormData),
    definition,
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
