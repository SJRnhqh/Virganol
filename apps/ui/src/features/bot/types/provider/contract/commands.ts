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
  // TODO: 若后续统一业务错误模型，评估收敛为结构化 code/message 契约，避免长期停留在宽泛字符串。
  error?: string;
}
