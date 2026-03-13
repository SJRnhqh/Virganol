// apps/ui/src/features/bot/types/provider/props/form.ts
// 内部引用
import type { ProviderFormData } from "../state";

/**
 * Provider 表单 Props：包含表单相关的字段定义、数据和操作
 * 用于需要表单交互的组件
 */
export interface WithProviderForm {
  /** 当前表单数据 */
  formData: ProviderFormData;
  /** 更新表单数据 */
  onUpdate: (formData: ProviderFormData) => void;
}
