// apps/ui/src/features/bot/types/provider/props/connected.ts
// 内部引用
import type { ProviderInfo } from "./info";
import type { WithProviderForm } from "./form";

/**
 * ProviderConnectedPanel 组件 Props（已连接状态）
 */
export interface ProviderConnectedPanelProps {
  provider: ProviderInfo;
  form: WithProviderForm;
}
