// apps/ui/src/features/bot/types/provider/custom/form.ts
// 内部引用
import type { ProviderFormData } from "../state";

/** Provider 表单字段配置（用于动态渲染表单输入控件） */
export interface ProviderFormField {
  key: keyof ProviderFormData;
  label: string;
  type: "text" | "password";
  placeholder?: string;
  optional?: boolean;
}

/** ProviderForm 变体配置结构 */
export interface ProviderFormVariantConfig {
  /** 当前变体下输入框是否禁用 */
  disabled: boolean;
  /** 字段标题样式 */
  labelClassName: string;
  /** 输入框样式 */
  inputClassName: string;
  /** Optional 提示样式 */
  optionalClassName: string;
}
