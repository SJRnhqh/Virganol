// apps/ui/src/features/bot/types/provider/store.ts
// 内部引用
import type { ProviderId } from "./config";
import type { ProviderCheckTrigger, ProviderIssue } from "./api";

// ── 单个 Provider 的数据结构 ─────────────────

export interface ProviderStatus {
  isConnected: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface ProviderModels {
  available: string[];
  enabled: Record<string, boolean>;
}

// ── Provider Store（per-provider 状态）────────

export interface ProviderState {
  providerConfig: Record<ProviderId, Record<string, string>>;
  providerStatus: Record<ProviderId, ProviderStatus>;
  providerModels: Record<ProviderId, ProviderModels>;

  setProviderConfig: (
    providerId: ProviderId,
    config: Record<string, string>,
  ) => void;
  setProviderStatus: (
    providerId: ProviderId,
    patch: Partial<ProviderStatus>,
  ) => void;
  resetProviderError: (providerId: ProviderId) => void;
  setAvailableModels: (providerId: ProviderId, models: string[]) => void;
  setModelEnabled: (
    providerId: ProviderId,
    model: string,
    enabled: boolean,
  ) => void;
  setAllModelsEnabled: (providerId: ProviderId, enabled: boolean) => void;
}

// ── Provider Check Store（生命周期全局状态）───

export type ProviderCheckPhase = "idle" | "checking" | "done" | "failed";

export interface ProviderCheckState {
  phase: ProviderCheckPhase;
  runId: string | null;
  trigger: ProviderCheckTrigger | null;
  issues: ProviderIssue[];
  errorCode: string | null;
  errorMessage: string | null;

  setChecking: (runId: string, trigger: ProviderCheckTrigger) => void;
  setDone: () => void;
  setFailed: (code: string, message?: string, issues?: ProviderIssue[]) => void;
  reset: () => void;
}
