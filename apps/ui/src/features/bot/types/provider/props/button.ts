// apps/ui/src/features/bot/types/provider/props/button.ts
// 内部引用
import type { WithCardState } from "./state";

/**
 * ProviderConnectionButton 组件 Props：连接按钮所需的输入
 * 用于 ProviderConnectionButton 组件
 */
export interface ProviderConnectionButtonProps extends WithCardState {
  /** 点击事件处理器 */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
