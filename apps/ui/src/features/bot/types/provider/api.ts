// apps/ui/src/features/bot/types/provider/api.ts

import type { ProviderId } from "./config";

/** 对应 Rust ConnectAndSaveProviderRequest */
export interface ConnectAndSaveProviderPayload {
  providerId: ProviderId;
  key: string;
  url?: string;
}

/** 对应 Rust ProviderRecord */
export interface ProviderRecord {
  url?: string;
  enabled_models: string[];
}

/** 对应 Rust HealthCheckResponse */
export interface HealthCheckResponse {
  success: boolean;
  available_models: string[];
  error?: string;
}

export type ProviderKeySource = "none" | "env" | "keyring";

/** 对应 Rust ProviderSecretMeta */
export interface ProviderSecretMeta {
  has_key: boolean;
  key_source: ProviderKeySource;
}

/** 对应 Rust ProviderStatusPayload（startup 推送） */
export interface ProviderStatusPayload {
  run_id: string;
  provider: ProviderId;
  config: ProviderRecord;
  health: HealthCheckResponse;
  secret_meta: ProviderSecretMeta;
}

export type ProviderCheckTrigger = "startup" | "manual_refresh";

/** 对应 Rust ProviderCheckFailureDetail */
export interface ProviderCheckFailureDetail {
  code: string;
  provider?: ProviderId;
  message: string;
}

/** 对应 Rust ProviderCheckFailedPayload */
export interface ProviderCheckFailedPayload {
  run_id: string;
  trigger: ProviderCheckTrigger;
  code: string;
  message: string;
  error_count: number;
  details: ProviderCheckFailureDetail[];
}
