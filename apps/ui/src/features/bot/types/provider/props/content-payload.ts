// apps/ui/src/features/bot/types/provider/props/content-payload.ts
// 内部引用
import type { ProviderInfo } from "./info";
import type { WithProviderForm } from "./form";

/**
 * ProviderConnectedPanel 内容接口（已连接状态）
 */
export interface ProviderConnectedContent {
  provider: ProviderInfo;
  form: WithProviderForm;
}
