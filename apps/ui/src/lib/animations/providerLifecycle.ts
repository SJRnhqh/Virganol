// apps/ui/src/lib/animations/providerLifecycle.ts
// 外部依赖
import type { Variants } from "framer-motion";

/* === Provider 生命周期动画 === */

// 1. 生命周期状态图标切换动画
// 用于 Cloud / CloudCheck / CloudAlert 等 phase 图标切换
export const phaseIconVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.18,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.18,
    },
  },
};

// 2. 手动刷新按钮点击反馈动画
export const refreshButtonVariants: Variants = {
  idle: {
    scale: 1,
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.08,
      ease: "easeInOut",
    },
  },
};
