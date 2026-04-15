// apps/ui/src/features/bot/types/provider/contract/connect.ts
// 内部引用
import type { ProviderId } from "../common";

/** 对应 Rust ConnectAndSaveProviderRequest */
export interface ConnectAndSaveProviderPayload {
  providerId: ProviderId;
  key: string;
  url?: string;
}

/** 对应 Rust ConnectAndSaveProviderResponse（connect 操作的前后端契约） */
export interface ConnectAndSaveProviderResponse {
  success: boolean;
  availableModels: string[];
  enabledModels: string[];
  error?: string;
}
