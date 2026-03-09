// apps/ui/src/features/bot/events/provider/handlers.ts
// 内部引用
import type {
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,
  ProviderStatusPayload,
} from "@/features/bot/types";
import {
  PROVIDER_DEFINITIONS,
  PROVIDER_CARD_STATES,
} from "@/features/bot/constants";
import {
  useProviderCollectionStore,
  useProviderCheckStore,
} from "@/features/bot/store";
import { isCurrentRun } from "./runGuard";

/** 生命周期开始：更新 checkStore 进入 checking 阶段 */
export function handleStarted(payload: ProviderCheckStartedPayload) {
  const checkStore = useProviderCheckStore.getState();
  checkStore.setChecking(payload.run_id, payload.trigger);
}

/** 单个 Provider 状态推送：将配置、连接状态、模型列表写入 providerStore */
export function handleProviderStatus(payload: ProviderStatusPayload) {
  if (!isCurrentRun(payload.run_id)) {
    console.warn(
      `[handler] stale provider-status ignored: run=${payload.run_id}`,
    );
    return;
  }

  const { provider, config, health } = payload;

  if (!(provider in PROVIDER_DEFINITIONS)) {
    console.warn(`[handler] unknown provider: ${provider}, skipping`);
    return;
  }

  const store = useProviderCollectionStore.getState();

  // 更新表单字段（持久化配置映射到前端）
  if (config.url) {
    store.setProviderForm(provider, { apiURL: config.url });
  }

  // 更新卡片状态
  const cardState = health.success
    ? PROVIDER_CARD_STATES.CONNECTED
    : PROVIDER_CARD_STATES.FAILED;
  store.setProviderCardState(provider, cardState);

  // 更新错误信息
  if (!health.success && health.error) {
    store.setProviderError(provider, health.error);
  } else {
    store.clearProviderError(provider);
  }

  // 更新模型状态
  if (health.success && health.available_models.length > 0) {
    const enabledSet = new Set(config.enabled_models);
    const enabled: Record<string, boolean> = {};
    for (const model of health.available_models) {
      enabled[model] = enabledSet.has(model);
    }
    store.setProviderModels(provider, {
      available: health.available_models,
      enabled,
    });
  }

  console.log(
    `[handler] ${provider}: online=${health.success}, models=${health.available_models.length}`,
  );
}

/** 生命周期正常结束：按失败数量决定走 done 或 degraded（业务失败） */
export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  if (!isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale completed ignored: run=${payload.run_id}`);
    return;
  }

  const checkStore = useProviderCheckStore.getState();
  if (payload.failed > 0) {
    // TODO: 评估 degraded 是否仍需保留全局错误文案，或改为日志/独立展示策略。
    checkStore.setDegraded(`${payload.failed} provider check(s) failed`);
  } else {
    checkStore.setDone();
  }
}

/** 生命周期异常终止：更新 checkStore 进入 failed 阶段，并将可定位的 issue 写入对应 provider */
export function handleFailed(payload: ProviderCheckFailedPayload) {
  const checkStore = useProviderCheckStore.getState();
  if (checkStore.runId !== null && !isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale failed ignored: run=${payload.run_id}`);
    return;
  }

  checkStore.setFailed(payload.code, payload.message);

  // issues 中带 provider 字段的，下沉到对应 provider 的错误状态
  if (payload.issues?.length) {
    // TODO: 收敛 provider issue 下沉逻辑，评估是否改为更明确的 store action 或批量写入入口。
    const store = useProviderCollectionStore.getState();
    for (const issue of payload.issues) {
      if (issue.provider in PROVIDER_DEFINITIONS) {
        store.setProviderCardState(issue.provider, PROVIDER_CARD_STATES.FAILED);
        store.setProviderError(issue.provider, issue.message);
      }
    }
  }

  console.error(
    `[React] check failed: run=${payload.run_id}, code=${payload.code}, message=${payload.message}`,
  );
}
