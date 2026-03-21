// apps/ui/src/features/bot/services/events/provider/handlers/dispatchers/checkPhase.ts
// 内部引用
import type { ProviderCheckTrigger } from "@/features/bot/types";
import { useProviderCheckStore } from "@/features/bot/store";

export const dispatchChecking = (runId: string, trigger: ProviderCheckTrigger) => {
  useProviderCheckStore.getState().setChecking(runId, trigger);
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
