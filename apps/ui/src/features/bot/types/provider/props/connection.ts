// apps/ui/src/features/bot/types/provider/props/connection.ts
// 内部引用
import type { ProviderFormData } from "../state";

/** 连接操作片段（可组合，仅暴露组件层需要的操作） */
export interface WithProviderConnection {
  onConnect?: (formData: ProviderFormData) => Promise<void>;
  onRetry?: (formData: ProviderFormData) => Promise<void>;
}
