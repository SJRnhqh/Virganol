// apps/ui/src/features/bot/services/events/provider/handlers/dispatchers/checkPhase.ts
// 内部引用
import type {
  ProviderCheckTrigger,
  ProviderBatchUpdates,
} from "@/features/bot/types";
import { PROVIDER_CARD_STATES } from "@/features/bot/constants";
import {
  useProviderCheckStore,
  useProviderCollectionStore,
} from "@/features/bot/store";
import type { ActiveProviderId } from "../validators/activeProviderGuard";

export const dispatchChecking = (
  runId: string,
  trigger: ProviderCheckTrigger,
) => {
  useProviderCheckStore.getState().setChecking(runId, trigger);
};

export const dispatchProviderBatch = (
  provider: ActiveProviderId,
  updates: ProviderBatchUpdates,
) => {
  useProviderCollectionStore.getState().updateProviderBatch(provider, updates);
};

export const dispatchDone = () => {
  useProviderCheckStore.getState().setDone();
};

export const dispatchDegraded = () => {
  useProviderCheckStore.getState().setDegraded();
};

export const dispatchFailed = (
  code: string,
  message: string,
  runId?: string,
) => {
  useProviderCheckStore.getState().setFailed(code, message, runId);
};

export const dispatchReset = () => {
  useProviderCheckStore.getState().reset();
};

export const dispatchProviderIssue = (
  provider: ActiveProviderId,
  message: string,
) => {
  // TODO: 此处分两次调用 setProviderCardState + setProviderError，触发两次 store 更新。
  // 与 dispatchProviderBatch 使用 updateProviderBatch 一次性批量更新的风格不一致，应统一。
  const store = useProviderCollectionStore.getState();
  store.setProviderCardState(provider, PROVIDER_CARD_STATES.FAILED);
  store.setProviderError(provider, message);
};
