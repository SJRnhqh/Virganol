// apps/ui/src/lib/animations/providerButton.ts
// 外部依赖
import type { Variants } from "framer-motion";

/* === Provider Button 动画组 === */

// 1. 按钮整体动画：缩放（颜色由 Tailwind CSS 处理）
export const providerButtonVariants: Variants = {
  // 默认状态
  idle: {
    scale: 1,
  },
  // hover 状态：不缩放，只依赖 Tailwind 颜色过渡
  hover: {
    scale: 1,
  },
  // 点击状态：快速缩小再恢复
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.08,
      ease: "easeInOut",
    },
  },
};

// 2. Connect 图标跳跃动画（unset 状态）
export const connectIconVariants: Variants = {
  // 默认状态
  idle: {
    x: 0,
  },
  // hover 状态：icon 向右跳跃
  hover: {
    x: [0, 2, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

// 3. Loading 图标旋转动画（pending 状态）
export const rotatingIconVariants: Variants = {
  // 默认状态：不旋转
  idle: {
    rotate: 0,
  },
  // 旋转状态：持续旋转
  rotating: {
    rotate: 360,
    transition: {
      duration: 1.5,
      ease: "linear",
      repeat: Infinity,
    },
  },
};
