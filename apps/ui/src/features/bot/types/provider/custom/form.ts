// apps/ui/src/features/bot/types/provider/custom/form.ts

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
