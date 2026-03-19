// apps/ui/src/features/bot/types/provider/props/form.ts
// 内部引用
import type { ProviderFormField } from "../custom";
import type { ProviderFormData } from "../state";
import type { ProviderEditableState } from "./state";

/**
 * Provider 表单数据片段：包含字段定义、当前值与更新操作。
 * 用于需要表单交互的内容组件。
 */
export interface WithProviderForm {
  /** 表单字段配置 */
  fields: ProviderFormField[];
  /** 当前表单数据 */
  formData: ProviderFormData;
  /** 更新表单数据（支持部分更新） */
  onUpdate: (patch: Partial<ProviderFormData>) => void;
}

/**
 * ProviderForm 组件 Props。
 */
export interface ProviderFormProps {
  /** 当前表单所属的可编辑阶段状态 */
  cardState: ProviderEditableState;
  /** 表单数据与操作 */
  form: WithProviderForm;
}
