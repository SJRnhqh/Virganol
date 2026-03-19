// apps/ui/src/features/bot/types/provider/props/body.ts
// 内部引用
import type { WithProviderConnection } from "./connection";
import type { ProviderInfo } from "./info";
import type { WithProviderForm } from "./form";
import type { WithCardState } from "./state";

/**
 * ProviderCardBody 组件 Props
 */
export interface ProviderCardBodyProps extends WithCardState {
  /** Provider 静态信息（id、名称、图标） */
  provider: ProviderInfo;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息 */
  errorMessage: string | null;
  /** 卡片级连接操作 */
  connection: WithProviderConnection;
}
