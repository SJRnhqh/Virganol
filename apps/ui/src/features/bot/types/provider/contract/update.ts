// apps/ui/src/features/bot/types/provider/contract/update.ts
// 内部引用
import type { ProviderId } from "../common";
import type { MutationResponse } from "./response";

/** 对应 Rust UpdateEnabledModelsRequest */
export interface UpdateEnabledModelsPayload {
  providerId: ProviderId;
  enabledModels: string[];
}

/** 对应 Rust UpdateEnabledModelsResponse */
export type UpdateEnabledModelsResponse = MutationResponse;
