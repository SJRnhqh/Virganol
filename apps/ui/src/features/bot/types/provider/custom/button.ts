// apps/ui/src/features/bot/types/provider/custom/button.ts
// 外部依赖
import type { Variants } from "framer-motion";

// 内部引用
import type { IconSlot } from "./icon";

// ────────────────────────────────────────────────────────────────────────────
// 双图标按钮结构
// ────────────────────────────────────────────────────────────────────────────

/** 双图标按钮结构（支持前置和后置图标的自定义按钮类型） */
export interface DualIconButton {
  /** 前置图标（左侧） */
  leading?: IconSlot;
  /** 后置图标（右侧） */
  trailing?: IconSlot;
}

// ────────────────────────────────────────────────────────────────────────────
// 按钮动画类型
// ────────────────────────────────────────────────────────────────────────────

/** 动画触发时机 */
export type AnimationTrigger = "hover" | "always" | "none";

/** 按钮动画结构 */
export interface ButtonAnimation {
  /** Framer Motion 动画变体（trigger 为 none 时可省略） */
  variant?: Variants;
  /** 动画触发时机 */
  trigger: AnimationTrigger;
}
