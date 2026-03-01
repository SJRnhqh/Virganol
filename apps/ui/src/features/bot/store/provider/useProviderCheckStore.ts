// apps/ui/src/features/bot/store/provider/useProviderCheckStore.ts
// 外部依赖
import { create } from "zustand";

// 内部引用
import { PROVIDER_CHECK_PHASES } from "@/features/bot/constants";
import type { ProviderCheckState } from "@/features/bot/types";

const initialState = {
  phase: PROVIDER_CHECK_PHASES.IDLE,
  runId: null,
  trigger: null,
  issues: [],
  errorCode: null,
  errorMessage: null,
};

export const useProviderCheckStore = create<ProviderCheckState>((set) => ({
  ...initialState,

  setChecking: (runId, trigger) =>
    set({
      phase: PROVIDER_CHECK_PHASES.CHECKING,
      runId,
      trigger,
      issues: [],
      errorCode: null,
      errorMessage: null,
    }),

  setDone: () =>
    set({
      phase: PROVIDER_CHECK_PHASES.DONE,
      issues: [],
      errorCode: null,
      errorMessage: null,
    }),

  setDegraded: (message) =>
    set({
      phase: PROVIDER_CHECK_PHASES.DEGRADED,
      issues: [],
      errorCode: null,
      errorMessage: message ?? null,
    }),

  setFailed: (code, message, issues) =>
    set({
      phase: PROVIDER_CHECK_PHASES.FAILED,
      errorCode: code,
      errorMessage: message ?? null,
      issues: issues ?? [],
    }),

  reset: () => set(initialState),
}));
