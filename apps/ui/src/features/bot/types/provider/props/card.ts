// apps/ui/src/features/bot/types/provider/props/card.ts
// 内部引用
import type { WithProviderId } from "./id";
import type { WithProviderMeta } from "./meta";
import type { WithProviderForm } from "./form";
import type { WithCardState } from "./state";
import type { ProviderConnectionProps } from "../base";

/**
 * ProviderCard 组件 Props：包含 provider 卡片渲染所需的完整数据
 * 用于 ProviderCard 组件
 */
export interface ProviderCardProps extends WithProviderId, WithCardState {
  /** 静态元数据（名称、图标） */
  meta: WithProviderMeta;
  /** 表单数据和操作 */
  form: WithProviderForm;
  /** 错误信息（无错误时为 null） */
  errorMessage: string | null;
  /** 卡片级连接操作 */
  connection: ProviderConnectionProps;
}
