// apps/ui/src/features/bot/events/provider/handlers.ts
// 内部引用
import type {
  ProviderCheckStartedPayload,
  ProviderCheckCompletedPayload,
  ProviderCheckFailedPayload,
  ProviderStatusPayload,
} from "@/features/bot/types";
import {
  PROVIDER_IDS,
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

  const store = useProviderCollectionStore.getState();

  // 更新表单字段（持久化配置映射到前端）
  // TODO: 待 CollectionStore 的 form 同步策略收敛后，统一处理 url 缺失/空值时的显式覆盖，避免旧值残留。
  if (config.url) {
    store.setProviderForm(provider, { apiURL: config.url });
  }

  // 按健康检查结果同步 provider 卡片状态：成功时写入模型快照，失败时清空模型并更新错误文案。
  if (health.success) {
    const enabledSet = new Set(config.enabled_models);
    const enabled: Record<string, boolean> = {};
    // 将“可用模型列表”与“已启用模型列表”合并为前端渲染所需的启用映射。
    for (const model of health.available_models) {
      enabled[model] = enabledSet.has(model);
    }

    store.setProviderCardState(provider, PROVIDER_CARD_STATES.CONNECTED);
    store.clearProviderError(provider);
    store.setProviderModels(provider, {
      available: health.available_models,
      enabled,
    });
  } else {
    store.setProviderCardState(provider, PROVIDER_CARD_STATES.FAILED);
    if (health.error) {
      store.setProviderError(provider, health.error);
    } else {
      store.clearProviderError(provider);
    }
    store.setProviderModels(provider, { available: [], enabled: {} });
  }
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
