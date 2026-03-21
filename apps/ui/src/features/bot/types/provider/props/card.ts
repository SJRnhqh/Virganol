// apps/ui/src/features/bot/types/provider/props/card.ts
// 内部引用
import type { ProviderInfo } from "./info";
import type { WithProviderForm } from "./form";
import type { WithCardState } from "./state";
import type { WithProviderConnection } from "./connection";

/**
 * ProviderCard 组件 Props：包含 provider 卡片渲染所需的完整数据
 * 用于 ProviderCard 组件
 */
export interface ProviderCardProps extends WithCardState {
  /** Provider 静态信息（id、名称、图标） */
  provider: ProviderInfo;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息（无错误时为 null） */
  errorMessage: string | null;
  /** 卡片级连接操作 */
  connection: WithProviderConnection;
}
