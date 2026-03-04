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
      duration: 0.35,
      ease: [0.32, 0, 0.67, 0] as const,
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

// 脉冲呼吸动画：用于 checking 状态的 icon 明暗交替
export const pulseIconVariants: Variants = {
  idle: {
    opacity: 1,
  },
  pulsing: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

/* === 4. Provider 生命周期状态 icon 切换动画 === */
// 淡入淡出 + 轻微缩放，用于 Cloud / CloudCheck 等 icon 切换
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

/* === 5. Provider 手动刷新按钮动画 === */
// 点击缩放反馈，hover 背景由外层 Tailwind class 管理
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
