// apps/ui/src/features/bot/types/provider/props/connected.ts
// 内部引用
import type { ProviderInfo } from "./info";

/**
 * Provider 已连接态的非敏感连接信息。
 * 仅保留 connected 面板展示所需字段，避免叶子组件感知编辑态表单能力。
 */
export interface ProviderConnectionInfo {
  /** 当前 Provider 的连接地址；无值时表示本地或默认连接。 */
  apiURL?: string;
}

/**
 * ProviderConnectedPanel 组件 Props（已连接状态）
 */
export interface ProviderConnectedPanelProps {
  provider: Pick<ProviderInfo, "id">;
  connectionInfo: ProviderConnectionInfo;
}
