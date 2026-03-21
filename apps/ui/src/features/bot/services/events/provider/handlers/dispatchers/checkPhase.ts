// apps/ui/src/features/bot/services/events/provider/handlers/dispatchers/checkPhase.ts
// 内部引用
import type {
  ProviderCheckTrigger,
  ProviderBatchUpdates,
} from "@/features/bot/types";
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

export const dispatchFailed = (code: string, message: string) => {
  useProviderCheckStore.getState().setFailed(code, message);
};

export const dispatchReset = () => {
  useProviderCheckStore.getState().reset();
};
