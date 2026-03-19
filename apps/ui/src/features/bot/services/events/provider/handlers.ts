// apps/ui/src/features/bot/services/events/provider/handlers.ts
// 内部引用
import type {
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
} from "@/features/bot/types";
import { PROVIDER_IDS, PROVIDER_CARD_STATES } from "@/features/bot/constants";
import {
  useProviderCheckStore,
  useProviderCollectionStore,
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
      `[React] stale provider-status ignored: run=${payload.run_id}`,
    );
    return;
  }

  // TODO: `secret_meta` 当前尚未接入前端状态与渲染，后续需结合密钥提示/UI 反馈统一消费。
  const { provider, config, health } = payload;

  if (!PROVIDER_IDS.includes(provider)) {
    console.warn(`[React] unknown provider: ${provider}, skipping`);
    return;
  }

  // 准备表单更新（持久化配置映射到前端）
  const formPatch = config.url ? { apiURL: config.url } : undefined;

  // 按健康检查结果准备状态更新
  let cardState, models, errorMessage;

  if (health.success) {
    const enabledSet = new Set(config.enabled_models);
    const enabled: Record<string, boolean> = {};
    // 将”可用模型列表”与”已启用模型列表”合并为前端渲染所需的启用映射。
    for (const model of health.available_models) {
      enabled[model] = enabledSet.has(model);
    }

    cardState = PROVIDER_CARD_STATES.CONNECTED;
    models = { available: health.available_models, enabled };
    errorMessage = null;
  } else {
    cardState = PROVIDER_CARD_STATES.FAILED;
    models = { available: [], enabled: {} };
    errorMessage = health.error || null;
  }

  // 批量更新（一次 set 调用，减少重渲染）
  const store = useProviderCollectionStore.getState();
  store.updateProviderBatch(provider, {
    form: formPatch,
    cardState,
    models,
    errorMessage,
  });
}

/** 生命周期正常结束：按失败数量决定走 done 或 degraded（业务失败） */
export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  if (!isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale completed ignored: run=${payload.run_id}`);
    return;
  }

  const checkStore = useProviderCheckStore.getState();
  if (payload.failed > 0) {
    checkStore.setDegraded();
    console.warn(
      `[React] ${payload.failed} provider check(s) failed during lifecycle check`,
    );
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
    const store = useProviderCollectionStore.getState();
    for (const issue of payload.issues) {
      if (PROVIDER_IDS.includes(issue.provider)) {
        store.setProviderCardState(issue.provider, PROVIDER_CARD_STATES.FAILED);
        // TODO: 后续若 provider 级错误码收敛为稳定契约，评估将 issue.code 一并下沉用于更细粒度渲染。
        // TODO: 当前结构性错误会直接覆盖已有业务错误文案；若后续需要同时保留多类错误或多条 issue，需设计统一展示策略。
        store.setProviderError(issue.provider, issue.message);
      } else {
        console.warn(
          `[React] unknown provider in issue: ${issue.provider}, skipping`,
        );
      }
    }
  }

  console.error(
    `[React] check failed: run=${payload.run_id}, code=${payload.code}, message=${payload.message}`,
  );
}
