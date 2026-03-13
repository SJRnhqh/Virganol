// apps/ui/src/features/bot/types/provider/props/card.ts
// 内部引用
import type { WithProviderMeta } from "./meta";
import type { WithProviderForm } from "./form";

/**
 * ProviderCard 组件 Props：包含 provider 卡片渲染所需的完整数据
 * 用于 ProviderCard 组件
 */
export interface ProviderCardProps {
  /** 静态元数据（名称、图标） */
  meta: WithProviderMeta;
  /** 表单数据和操作 */
  form: WithProviderForm;
}
