// apps/ui/src/features/bot/types/provider/props/id.ts
// 外部依赖
import type { ProviderId } from "../common";

/**
 * 基础 Props：包含 provider 标识
 * 用于所有需要 provider id 的组件
 */
export interface WithProviderId {
  id: ProviderId;
}
