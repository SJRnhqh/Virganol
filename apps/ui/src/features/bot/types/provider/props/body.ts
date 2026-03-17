// apps/ui/src/features/bot/types/provider/props/body.ts
// 内部引用
import type { ProviderCardState } from "../state";
import type { ProviderConnectionProps } from "../base";
import type { WithProviderId } from "./id";
import type { WithProviderForm } from "./form";

/**
 * ProviderCardBody 组件 Props
 */
export interface ProviderCardBodyProps {
  /** 当前 Provider 标识 */
  providerId: WithProviderId["providerId"];
  /** 当前卡片状态 */
  cardState: ProviderCardState;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息 */
  errorMessage: string | null;
  /** 卡片级连接操作 */
  connection: ProviderConnectionProps;
}
