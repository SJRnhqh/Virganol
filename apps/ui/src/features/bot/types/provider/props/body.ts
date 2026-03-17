// apps/ui/src/features/bot/types/provider/props/body.ts
// TODO: connection 可能需要进一步拆分操作与数据
// 内部引用
import type { ProviderCardState } from "../state";
import type { ProviderConnectionProps } from "../base";
import type { WithProviderForm } from "./form";
import type { WithProviderModels } from "./models";

/**
 * ProviderCardBody 组件 Props
 */
export interface ProviderCardBodyProps {
  /** 当前卡片状态 */
  cardState: ProviderCardState;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息 */
  errorMessage: string | null;
  connection: ProviderConnectionProps;
  models: WithProviderModels;
}
