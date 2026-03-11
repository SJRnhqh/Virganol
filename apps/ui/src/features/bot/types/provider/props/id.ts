// apps/ui/src/features/bot/types/provider/props/id.ts
// 外部依赖
import type { ProviderId } from "../common";

/**
 * 基础 Props：包含 providerId
 * 用于所有需要 providerId 的组件
 */
export interface WithProviderId {
  providerId: ProviderId;
}
