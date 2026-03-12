// apps/ui/src/features/bot/types/provider/custom/button.ts
// 外部依赖
import type { Variants } from "framer-motion";

// ────────────────────────────────────────────────────────────────────────────
// 双图标按钮结构
// ────────────────────────────────────────────────────────────────────────────

/** 双图标按钮结构（支持前置和后置图标的自定义按钮类型） */
export interface DualIconButton {
  /** 前置图标（左侧） */
  leading?: React.ComponentType<{ className?: string }>;
  /** 后置图标（右侧） */
  trailing?: React.ComponentType<{ className?: string }>;
  /** 前置图标额外样式 */
  leadingClassName?: string;
  /** 后置图标额外样式 */
  trailingClassName?: string;
}

// ────────────────────────────────────────────────────────────────────────────
// 按钮动画类型
// ────────────────────────────────────────────────────────────────────────────

/** 动画触发时机 */
export type AnimationTrigger = "hover" | "always";

/** 按钮动画结构 */
export interface ButtonAnimation {
  /** Framer Motion 动画变体 */
  variant: Variants;
  /** 动画触发时机 */
  trigger: AnimationTrigger;
}
