// apps/ui/src/features/bot/services/events/provider/handlers/check.ts
// TODO: 当前 check handlers 已接入 validators / adapters / schedulers，
// 功能链路已经打通，但该实现尚未完成一轮系统性审查。
// 在完全消化事件时序与 store 写入边界之前，应视为“可提交的阶段版本”，
// 而不是最终定稿。
// 内部引用
import type {
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import {
  useProviderCheckStore,
  useProviderCollectionStore,
} from "@/features/bot/store";
import { adaptProviderStatusToBatchUpdates } from "./adapters";
import {
  scheduleCheckCompleted,
  scheduleCheckFailed,
  scheduleCheckStarted,
} from "./schedulers";
import { isActiveProviderId, isCurrentRun } from "./validators";

/** 生命周期开始：交由 phase scheduler 进入 checking 阶段 */
export function handleStarted(payload: ProviderCheckStartedPayload) {
  scheduleCheckStarted(payload.run_id, payload.trigger);
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

  if (!isActiveProviderId(provider)) {
    console.warn(`[React] unknown provider: ${provider}, skipping`);
    return;
  }

  // 批量更新（一次 set 调用，减少重渲染）
  const store = useProviderCollectionStore.getState();
  store.updateProviderBatch(
    provider,
    adaptProviderStatusToBatchUpdates({ config, health }),
  );
}

/** 生命周期正常结束：按失败数量决定走 done / degraded，并交由 scheduler 编排终态回归 */
export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  if (!isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale completed ignored: run=${payload.run_id}`);
    return;
  }

  if (payload.failed > 0) {
    scheduleCheckCompleted(payload.run_id, "degraded");
    console.warn(
      `[React] ${payload.failed} provider check(s) failed during lifecycle check`,
    );
  } else {
    scheduleCheckCompleted(payload.run_id, "done");
  }
}

/** 生命周期异常终止：failed 终态交由 scheduler 编排，并将可定位的 issue 写入对应 provider */
export function handleFailed(payload: ProviderCheckFailedPayload) {
  const checkStore = useProviderCheckStore.getState();
  if (checkStore.runId !== null && !isCurrentRun(payload.run_id)) {
    console.warn(`[React] stale failed ignored: run=${payload.run_id}`);
    return;
  }

  scheduleCheckFailed(payload.run_id, payload.code, payload.message);

  // issues 中带 provider 字段的，下沉到对应 provider 的错误状态
  if (payload.issues?.length) {
    const store = useProviderCollectionStore.getState();
    for (const issue of payload.issues) {
      if (isActiveProviderId(issue.provider)) {
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
