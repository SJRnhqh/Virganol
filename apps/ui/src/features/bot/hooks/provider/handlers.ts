// apps/ui/src/features/bot/hooks/provider/handlers.ts
// 内部引用
import type {
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,
  ProviderStatusPayload,
} from "@/features/bot/types";
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { useProviderStore, useProviderCheckStore } from "@/features/bot/store";

/** 生命周期开始：更新 checkStore 进入 checking 阶段 */
export function handleStarted(payload: ProviderCheckStartedPayload) {
  useProviderCheckStore.getState().setChecking(payload.run_id, payload.trigger);

  console.log(
    `[handler] check started: run=${payload.run_id}, trigger=${payload.trigger}, total=${payload.total}, loaded_total=${payload.loaded_total}, skipped_total=${payload.skipped_total}`,
  );
}

/** 单个 Provider 状态推送：将配置、连接状态、模型列表写入 providerStore */
export function handleProviderStatus(payload: ProviderStatusPayload) {
  const { provider, config, health } = payload;

  if (!(provider in PROVIDER_DEFINITIONS)) {
    console.warn(`[handler] unknown provider: ${provider}, skipping`);
    return;
  }

  const store = useProviderStore.getState();

  // 持久化配置映射到前端字段
  const frontendConfig: Record<string, string> = {};
  if (config.url) frontendConfig.apiURL = config.url;
  store.setProviderConfig(provider, frontendConfig);

  // 连接状态
  store.setProviderStatus(provider, {
    isConnected: health.success,
    isLoading: false,
    isError: !health.success,
    errorMessage: health.error,
  });

  // 可用模型列表 + 已启用状态
  if (health.success && health.available_models.length > 0) {
    store.setAvailableModels(provider, health.available_models);

    const enabledSet = new Set(config.enabled_models);
    for (const model of health.available_models) {
      store.setModelEnabled(provider, model, enabledSet.has(model));
    }
  }

  console.log(
    `[handler] ${provider}: online=${health.success}, models=${health.available_models.length}`,
  );
}

/** 生命周期正常结束：更新 checkStore 进入 done 阶段 */
export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  useProviderCheckStore.getState().setDone();

  console.log(
    `[handler] check completed: run=${payload.run_id}, succeeded=${payload.succeeded}, failed=${payload.failed}, duration=${payload.duration_ms}ms`,
  );
}

/** 生命周期异常终止：更新 checkStore 进入 failed 阶段，并将可定位的 issue 写入对应 provider */
export function handleFailed(payload: ProviderCheckFailedPayload) {
  useProviderCheckStore.getState().setFailed(payload.code, payload.message, payload.issues);

  // issues 中带 provider 字段的，下沉到对应 provider 的错误状态
  if (payload.issues?.length) {
    const store = useProviderStore.getState();
    for (const issue of payload.issues) {
      if (issue.provider in PROVIDER_DEFINITIONS) {
        store.setProviderStatus(issue.provider, {
          isError: true,
          errorMessage: issue.message,
        });
      }
    }
  }

  console.error(
    `[handler] check failed: run=${payload.run_id}, code=${payload.code}, message=${payload.message}`,
  );
}

