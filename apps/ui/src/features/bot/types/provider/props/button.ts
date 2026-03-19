// apps/ui/src/features/bot/types/provider/props/button.ts
// 内部引用
import type { WithCardState } from "./state";

/** Provider 按钮触发的业务动作。 */
export type ProviderButtonAction = () => void | Promise<void>;

/**
 * ProviderConnectionButton 组件 Props：连接按钮所需的输入
 */
export interface ProviderConnectionButtonProps extends WithCardState {
  /** 点击后触发的业务动作 */
  onClick?: ProviderButtonAction;
}

/**
 * ProviderModelToggleButton 组件 Props：模型启用开关按钮所需的输入
 */
export interface ProviderModelToggleButtonProps {
  /** 当前按钮对应的启用状态 */
  checked: boolean;
  /** 无障碍语义角色 */
  role: "checkbox" | "switch";
  /** 点击后触发的业务动作 */
  onClick: ProviderButtonAction;
}
