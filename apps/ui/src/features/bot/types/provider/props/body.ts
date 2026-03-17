// apps/ui/src/features/bot/types/provider/props/body.ts
// 内部引用
import type { ProviderCardState } from "../state";
import type { ProviderConnectionProps } from "../base";
import type { ProviderInfo } from "./info";
import type { WithProviderForm } from "./form";

/**
 * ProviderCardBody 组件 Props
 */
export interface ProviderCardBodyProps {
  /** Provider 静态信息（id、名称、图标） */
  provider: ProviderInfo;
  /** 当前卡片状态 */
  cardState: ProviderCardState;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息 */
  errorMessage: string | null;
  /** 卡片级连接操作 */
  connection: ProviderConnectionProps;
}
