// apps/ui/src/features/bot/types/provider/props/button.ts
// 内部引用
import type { WithCardState } from "./state";

/**
 * ProviderConnectionButton 组件 Props：连接按钮所需的输入
 */
export interface ProviderConnectionButtonProps extends WithCardState {
  /** 点击事件处理器 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * ProviderModelToggleButton 组件 Props：模型启用开关按钮所需的输入
 */
export interface ProviderModelToggleButtonProps {
  /** 当前按钮对应的启用状态 */
  checked: boolean;
  /** 无障碍语义角色 */
  role: "checkbox" | "switch";
  /** 点击事件处理器 */
  onClick: () => void;
}
