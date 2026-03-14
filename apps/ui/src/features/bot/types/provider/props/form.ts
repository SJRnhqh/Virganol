// apps/ui/src/features/bot/types/provider/props/form.ts
// 内部引用
import type { ProviderField } from "../definition";
import type { ProviderFormData } from "../state";
import type { ProviderEditableState } from "./state";

/**
 * Provider 表单数据片段：包含字段定义、当前值与更新操作。
 * 用于需要表单交互的内容组件。
 */
export interface WithProviderForm {
  /** 当前表单数据 */
  formData: ProviderFormData;
  /** 更新表单数据 */
  onUpdate: (formData: ProviderFormData) => void;
}

/**
 * Provider 表单内容载荷。
 * 用于 `unset` / `pending` 两个可编辑阶段的内容路由。
 */
export interface ProviderFormContent {
  /** 当前 Provider 的表单字段定义 */
  fields: ProviderField[];
  /** 当前表单数据与更新操作 */
  form: WithProviderForm;
}

/**
 * ProviderForm 组件 Props。
 * 在表单内容载荷基础上补充当前可编辑阶段状态。
 */
export interface ProviderFormProps extends ProviderFormContent {
  /** 当前表单所属的可编辑阶段状态 */
  cardState: ProviderEditableState;
}
