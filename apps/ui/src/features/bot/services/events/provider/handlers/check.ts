// apps/ui/src/features/bot/services/events/provider/handlers/check.ts
// 内部引用
import type {
  ProviderStatusPayload,
  ProviderCheckFailedPayload,
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
} from "@/features/bot/types";
import { adaptProviderStatusToBatchUpdates } from "./adapters";
import {
  dispatchChecking,
  dispatchDone,
  dispatchDegraded,
  dispatchFailed,
  dispatchReset,
  dispatchProviderBatch,
  dispatchProviderIssue,
} from "./dispatchers";
import {
  disposeCheckPhaseScheduler,
  scheduleCheckStarted,
  scheduleCheckCompleted,
  scheduleCheckFailed,
} from "./schedulers";
import { isActiveProviderId, resolveRunDisposition } from "./validators";

/** 统一释放 handler 内部调度资源，供 listen 在会话 teardown 时调用。 */
export function disposeProviderCheckHandlers() {
  disposeCheckPhaseScheduler();
}

/** 生命周期开始：validate → schedule，进入 checking 阶段 */
// 不做 resolveRunDisposition 校验：此 handler 本身建立 current run，无前序 run_id 可比对。
// 重复触发防护由上层 check.ts 的 checkInFlight 保证，属已知跨层依赖。
export function handleStarted(payload: ProviderCheckStartedPayload) {
  scheduleCheckStarted(payload.run_id, () =>
    dispatchChecking(payload.run_id, payload.trigger),
  );
}

const warnIgnoredRun = (
  event: "provider-status" | "completed" | "failed",
  disposition: "orphan" | "stale",
  runId: string,
) => {
  // TODO: 当前日志尚未统一管理，先以内聚在 handler 层的局部辅助函数承接；
  // 后续若建设统一日志/错误上报入口，再评估迁移到同层 logging 模块。
  console.warn(`[React] ${disposition} ${event} ignored: run=${runId}`);
};

/** 单个 Provider 状态推送：validate → adapt → dispatch 批量更新 */
export function handleProviderStatus(payload: ProviderStatusPayload) {
  const disposition = resolveRunDisposition(payload.run_id);
  if (disposition !== "current") {
    warnIgnoredRun("provider-status", disposition, payload.run_id);
    return;
  }

  // TODO: `secret_meta` 当前尚未接入前端状态与渲染，后续需结合密钥提示/UI 反馈统一消费。
  const { provider, config, health } = payload;

  if (!isActiveProviderId(provider)) {
    console.warn(`[React] inactive runtime provider ignored: ${provider}`);
    return;
  }

  dispatchProviderBatch(
    provider,
    adaptProviderStatusToBatchUpdates({ config, health }),
  );
}

/** 生命周期正常结束：validate → 按失败数量 schedule done / degraded → idle */
export function handleCompleted(payload: ProviderCheckCompletedPayload) {
  const disposition = resolveRunDisposition(payload.run_id);
  if (disposition !== "current") {
    warnIgnoredRun("completed", disposition, payload.run_id);
    return;
  }

  const phase = payload.failed > 0 ? "degraded" : "done";
  const onTerminal = phase === "degraded" ? dispatchDegraded : dispatchDone;

  if (phase === "degraded") {
    console.warn(
      `[React] ${payload.failed} provider check(s) failed during lifecycle check`,
    );
  }

  scheduleCheckCompleted(payload.run_id, phase, onTerminal, dispatchReset);
}

/** 生命周期异常终止：validate → schedule failed → idle，per-provider issue 下沉 */
export function handleFailed(payload: ProviderCheckFailedPayload) {
  const disposition = resolveRunDisposition(payload.run_id);
  if (disposition === "stale") {
    warnIgnoredRun("failed", disposition, payload.run_id);
    return;
  }

  if (disposition === "orphan") {
    console.warn(
      `[React] orphan failed accepted without active run: run=${payload.run_id}`,
    );
  }

  scheduleCheckFailed(
    payload.run_id,
    () => dispatchFailed(payload.code, payload.message, payload.run_id),
    dispatchReset,
  );

  if (payload.issues?.length) {
    for (const issue of payload.issues) {
      if (isActiveProviderId(issue.provider)) {
        // TODO: 后续若 provider 级错误码收敛为稳定契约，评估将 issue.code 一并下沉用于更细粒度渲染。
        // TODO: 当前结构性错误会直接覆盖已有业务错误文案；若后续需要同时保留多类错误或多条 issue，需设计统一展示策略。
        dispatchProviderIssue(issue.provider, issue.message);
      } else {
        console.warn(
          `[React] inactive runtime provider issue ignored: ${issue.provider}`,
        );
      }
    }
  }

  console.error(
    `[React] check failed: run=${payload.run_id}, code=${payload.code}, message=${payload.message}`,
  );
}
