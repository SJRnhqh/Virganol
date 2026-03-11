// apps/ui/src/features/bot/types/provider/props/form.ts
// 内部引用
import type { ProviderFormData } from "../state";

/**
 * Provider 表单 Props：包含表单相关的字段定义、数据和操作
 * 用于需要表单交互的组件
 */
export interface WithProviderForm {
  // TODO: 重新设计表单 Props 结构
  // 需要包含所有与表单相关的部分：
  // - 字段定义（ProviderField[]）
  // - 表单数据（ProviderFormData）
  // - 更新操作（onUpdate）
  // - 重置操作（onReset，由 Hook 封装）
  // - 其他表单相关字段待确定

  /** 当前表单数据 */
  data: ProviderFormData;
}
