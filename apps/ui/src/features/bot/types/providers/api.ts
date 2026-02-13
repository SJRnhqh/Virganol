// apps/ui/src/features/bot/types/providers/api.ts
// 内部引用
import type { ProviderId } from "./config";

// 连接请求
export interface ConnectProviderRequest extends Record<string, unknown> {
  provider_id: ProviderId;
  config: Record<string, string>;
}

// 连接响应
export interface ConnectProviderResponse {
  success: boolean;
  data?: {
    connected: boolean;
    available_models?: string[];
  };
  error?: string;
}

/** 对应 Rust ProviderRecord */
export interface ProviderRecord {
  url: string;
  key: string;
  enabled_models: string[];
}

/** 对应 Rust HealthCheckResponse */
export interface HealthCheckResponse {
  success: boolean;
  available_models: string[];
  error?: string;
}

/** 对应 Rust ProviderStatusPayload（startup 推送） */
export interface ProviderStatusPayload {
  provider_id: string;
  config: ProviderRecord;
  health: HealthCheckResponse;
}