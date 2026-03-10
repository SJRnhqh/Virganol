// apps/ui/src/features/bot/store/provider/useProviderCheckStore.ts
// 外部依赖
import { create } from "zustand";

// 内部引用
import type { ProviderCheckState } from "@/features/bot/types";
import { PROVIDER_CHECK_PHASES } from "@/features/bot/constants";

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

  setDegraded: () =>
    set({
      phase: PROVIDER_CHECK_PHASES.DEGRADED,
    }),

  setFailed: (code, message) =>
    set({
      phase: PROVIDER_CHECK_PHASES.FAILED,
      errorCode: code,
      errorMessage: message,
    }),

  reset: () => set(emptyCheckState),
}));
