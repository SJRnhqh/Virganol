// apps/ui/src/features/bot/services/events/provider/handlers/adapters/status.ts
// 内部引用
import type {
  ProviderBatchUpdates,
  ProviderStatusPayload,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";

/**
 * 将 provider status payload 适配为前端 collection store 可消费的批量更新对象。
 * 适配层只负责字段翻译，不负责校验和状态提交。
 */
export function adaptProviderStatusToBatchUpdates({
  config,
  health,
}: Pick<ProviderStatusPayload, "config" | "health">): ProviderBatchUpdates {
  const formPatch = config.url ? { apiURL: config.url } : undefined;

  if (health.success) {
    const enabledSet = new Set(config.enabled_models);
    const enabled: Record<string, boolean> = {};

    for (const model of health.available_models) {
      enabled[model] = enabledSet.has(model);
    }

    return {
      form: formPatch,
      cardState: PROVIDER_CARD_STATES.CONNECTED,
      models: {
        available: health.available_models,
        enabled,
      },
      errorMessage: null,
    };
  }

  return {
    form: formPatch,
    cardState: PROVIDER_CARD_STATES.FAILED,
    models: { available: [], enabled: {} },
    errorMessage: health.error ?? null,
  };
}
