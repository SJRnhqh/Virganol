// apps/ui/src/features/bot/hooks/provider/handlers.ts
// 内部引用
import type {
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,
  ProviderStatusPayload,
} from "@/features/bot/types";
import { PROVIDER_DEFINITIONS } from "@/features/bot/constants";
import { useProviderStore } from "@/features/bot/store/provider/useProviderStore";
import { useProviderCheckStore } from "@/features/bot/store/provider/useProviderCheckStore";

export function handleStarted(payload: ProviderCheckStartedPayload) {
  useProviderCheckStore.getState().setChecking(payload.run_id, payload.trigger);

  console.log(
    `[handler] check started: run=${payload.run_id}, trigger=${payload.trigger}, total=${payload.total}, loaded_total=${payload.loaded_total}, skipped_total=${payload.skipped_total}`,
  );
}

export function handleProviderStatus(payload: ProviderStatusPayload) {
  const { provider, config, health } = payload;

  if (!(provider in PROVIDER_DEFINITIONS)) {
    console.warn(`[handler] unknown provider: ${provider}, skipping`);
    return;
  }

  const store = useProviderStore.getState();

  const frontendConfig: Record<string, string> = {};
  if (config.url) frontendConfig.apiURL = config.url;
  store.setProviderConfig(provider, frontendConfig);

  store.setProviderStatus(provider, {
    isConnected: health.success,
    isLoading: false,
    isError: !health.success,
    errorMessage: health.error,
  });

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

export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  useProviderCheckStore.getState().setDone();

  console.log(
    `[handler] check completed: run=${payload.run_id}, succeeded=${payload.succeeded}, failed=${payload.failed}, duration=${payload.duration_ms}ms`,
  );
}

export function handleFailed(payload: ProviderCheckFailedPayload) {
  useProviderCheckStore.getState().setFailed(payload.code, payload.message, payload.issues);

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
