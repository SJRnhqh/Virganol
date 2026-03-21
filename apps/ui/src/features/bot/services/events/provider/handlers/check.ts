// apps/ui/src/features/bot/services/events/provider/handlers/check.ts
// 内部引用
import type {
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import { useProviderCheckStore, useProviderCollectionStore } from "@/features/bot/store";
import { adaptProviderStatusToBatchUpdates } from "./adapters";
import {
  dispatchChecking,
  dispatchDone,
  dispatchDegraded,
  dispatchFailed,
  dispatchReset,
  dispatchProviderBatch,
} from "./dispatchers";
import {
  scheduleCheckStarted,
  scheduleCheckCompleted,
  scheduleCheckFailed,
} from "./schedulers";
import { isActiveProviderId, isCurrentRun } from "./validators";

/** 生命周期开始：validate → schedule，进入 checking 阶段 */
export function handleStarted(payload: ProviderCheckStartedPayload) {
  scheduleCheckStarted(
    payload.run_id,
    () => dispatchChecking(payload.run_id, payload.trigger),
  );
}

/** 单个 Provider 状态推送：validate → adapt → dispatch 批量更新 */
export function handleProviderStatus(payload: ProviderStatusPayload) {
  if (!isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale provider-status ignored: run=${payload.run_id}`);
    return;
  }

  // TODO: `secret_meta` 当前尚未接入前端状态与渲染，后续需结合密钥提示/UI 反馈统一消费。
  const { provider, config, health } = payload;

  if (!isActiveProviderId(provider)) {
    console.warn(`[React] unknown provider: ${provider}, skipping`);
    return;
  }

  dispatchProviderBatch(provider, adaptProviderStatusToBatchUpdates({ config, health }));
}

/** 生命周期正常结束：validate → 按失败数量 schedule done / degraded → idle */
export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  if (!isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale completed ignored: run=${payload.run_id}`);
    return;
  }

  const phase = payload.failed > 0 ? "degraded" : "done";
  const onTerminal = phase === "degraded" ? dispatchDegraded : dispatchDone;

  if (phase === "degraded") {
    console.warn(`[React] ${payload.failed} provider check(s) failed during lifecycle check`);
  }

  scheduleCheckCompleted(payload.run_id, phase, onTerminal, dispatchReset);
}

/** 生命周期异常终止：validate → schedule failed → idle，per-provider issue 下沉 */
export function handleFailed(payload: ProviderCheckFailedPayload) {
  const checkStore = useProviderCheckStore.getState();
  if (checkStore.runId !== null && !isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale failed ignored: run=${payload.run_id}`);
    return;
  }

  scheduleCheckFailed(
    payload.run_id,
    () => dispatchFailed(payload.code, payload.message),
    dispatchReset,
  );

  if (payload.issues?.length) {
    const store = useProviderCollectionStore.getState();
    for (const issue of payload.issues) {
      if (isActiveProviderId(issue.provider)) {
        store.setProviderCardState(issue.provider, PROVIDER_CARD_STATES.FAILED);
        // TODO: 后续若 provider 级错误码收敛为稳定契约，评估将 issue.code 一并下沉用于更细粒度渲染。
        // TODO: 当前结构性错误会直接覆盖已有业务错误文案；若后续需要同时保留多类错误或多条 issue，需设计统一展示策略。
        store.setProviderError(issue.provider, issue.message);
      } else {
        console.warn(`[React] unknown provider in issue: ${issue.provider}, skipping`);
      }
    }
  }

  console.error(`[React] check failed: run=${payload.run_id}, code=${payload.code}, message=${payload.message}`);
}
