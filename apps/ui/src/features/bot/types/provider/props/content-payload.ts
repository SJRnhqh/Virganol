// apps/ui/src/features/bot/types/provider/props/content-payload.ts
// 内部引用
import type { WithProviderForm } from "./form";
import type { WithProviderModels } from "./models";

/**
 * ProviderConnectedPanel 内容接口（已连接状态）
 */
export interface ProviderConnectedContent {
  form: WithProviderForm;
  models: WithProviderModels;
}
