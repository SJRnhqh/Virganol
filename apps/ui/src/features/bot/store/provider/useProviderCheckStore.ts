// apps/ui/src/features/bot/store/provider/useProviderCheckStore.ts
// 外部依赖
import { create } from "zustand";

// 内部引用
import { PROVIDER_CHECK_PHASES } from "@/features/bot/constants";
import type { ProviderCheckState } from "@/features/bot/types";

const emptyCheckState = {
  phase: PROVIDER_CHECK_PHASES.IDLE,
  runId: null,
  trigger: null,
  errorCode: null,
  errorMessage: null,
};

export const useProviderCheckStore = create<ProviderCheckState>((set) => ({
  ...emptyCheckState,

  setChecking: (runId, trigger) =>
    set({
      ...emptyCheckState,
      phase: PROVIDER_CHECK_PHASES.CHECKING,
      runId,
      trigger,
    }),

  setDone: () =>
    set({
      phase: PROVIDER_CHECK_PHASES.DONE,
    }),

  setDegraded: (message) =>
    set({
      phase: PROVIDER_CHECK_PHASES.DEGRADED,
      errorCode: null,
      errorMessage: message ?? null,
    }),

  setFailed: (code, message) =>
    set({
      phase: PROVIDER_CHECK_PHASES.FAILED,
      errorCode: code,
      errorMessage: message ?? null,
    }),

  reset: () => set(emptyCheckState),
}));
