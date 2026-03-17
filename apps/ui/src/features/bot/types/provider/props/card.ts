// apps/ui/src/features/bot/types/provider/props/card.ts
// TODO: 待收紧 - connection/models 可能需要进一步拆分操作与数据
// 内部引用
import type { WithProviderMeta } from "./meta";
import type { WithProviderForm } from "./form";
import type { WithCardState } from "./state";
import type { WithProviderModels } from "./models";
import type { ProviderConnectionProps } from "../base";

/**
 * ProviderCard 组件 Props：包含 provider 卡片渲染所需的完整数据
 * 用于 ProviderCard 组件
 */
export interface ProviderCardProps extends WithCardState {
  /** 静态元数据（名称、图标） */
  meta: WithProviderMeta;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息（无错误时为 null） */
  errorMessage: string | null;
  connection: ProviderConnectionProps;
  models: WithProviderModels;
}
