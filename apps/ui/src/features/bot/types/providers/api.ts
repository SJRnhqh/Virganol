// apps/ui/src/features/bot/types/providers/api.ts
// 内部引用
import type { ProviderId } from "@/features/bot/types/llmProviders";

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
