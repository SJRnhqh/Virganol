// apps/ui/src/features/bot/store/provider/useProviderCheckStore.ts
import { create } from "zustand";

import type { ProviderCheckState } from "@/features/bot/types";

const initialState = {
  phase: "idle" as const,
  runId: null,
  trigger: null,
  issues: [],
  errorCode: null,
  errorMessage: null,
};

export const useProviderCheckStore = create<ProviderCheckState>((set) => ({
  ...initialState,

  setChecking: (runId, trigger) =>
    set({ phase: "checking", runId, trigger, issues: [], errorCode: null, errorMessage: null }),

  setDone: () =>
    set({ phase: "done" }),

  setFailed: (code, message, issues) =>
    set({ phase: "failed", errorCode: code, errorMessage: message ?? null, issues: issues ?? [] }),

  reset: () =>
    set(initialState),
}));
