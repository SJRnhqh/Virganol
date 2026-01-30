// apps/ui/src/lib/animations.ts
import type { Variants } from "framer-motion";

{
  /* === 1. Settings窗口动画 === */
}
// 1. 纯逻辑遮罩
export const modalBackdrop: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// 2. 纸张容器 (父级)：保留转动效果的流畅动画
export const paperUnfoldVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    rotateX: 30,
    y: 30,
    transformPerspective: 1200,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1] as const,
      when: "beforeChildren",
      staggerChildren: 0,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    rotateX: 30,
    y: 30,
    transition: {
      duration: 0.35, // 关闭更快，不浪费时间
      ease: [0.32, 0, 0.67, 0] as const, // easeInCubic - 平滑加速消失
      when: "afterChildren",
    },
  },
};

/* === 2. Settings Tab 面板切换动画 === */
// 优化后的面板切换：快速流畅
export const panelSwitchVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 12,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};
