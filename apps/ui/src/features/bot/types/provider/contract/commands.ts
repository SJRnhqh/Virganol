// apps/ui/src/features/bot/types/provider/contract/commands.ts
// 内部引用
import type { ProviderId } from "../common";

/** 对应 Rust ConnectAndSaveProviderRequest */
export interface ConnectAndSaveProviderPayload {
  providerId: ProviderId;
  key: string;
  url?: string;
}

/** 对应 Rust HealthCheckResponse */
export interface HealthCheckResponse {
  success: boolean;
  available_models: string[];
  error?: string;
}
