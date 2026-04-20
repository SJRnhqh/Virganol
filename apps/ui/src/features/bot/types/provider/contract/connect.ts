// apps/ui/src/features/bot/types/provider/contract/connect.ts
// 内部引用
import type { ProviderId } from "../common";
import type { MutationResponse } from "./response";

/** 对应 Rust ConnectAndSaveProviderRequest */
export interface ConnectAndSaveProviderPayload {
  providerId: ProviderId;
  key: string;
  url?: string;
}

/** 对应 Rust ConnectAndSaveProviderResponse */
export interface ConnectAndSaveProviderResponse extends MutationResponse {
  availableModels: string[];
  enabledModels: string[];
}
