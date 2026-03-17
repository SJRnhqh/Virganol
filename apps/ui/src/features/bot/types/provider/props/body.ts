// apps/ui/src/features/bot/types/provider/props/body.ts
// TODO: 待收紧 - onReset 应合并到 form.onReset；connection/models 可能需要进一步拆分操作与数据
// 内部引用
import type { ProviderCardState } from "../state";
import type { ProviderConnectionProps, ProviderModelProps } from "../base";
import type { WithProviderForm } from "./form";

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
  onReset: () => void;
  connection: ProviderConnectionProps;
  models: ProviderModelProps;
}
