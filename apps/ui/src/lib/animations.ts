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

/* === 3. Provider Connect 按钮动画 === */
// 可爱的连接按钮：icon 跳跃 + 整体缩放反馈 + 丝滑的颜色过渡
export const connectButtonVariants: Variants = {
  // 默认状态
  idle: {
    scale: 1,
    color: "rgba(139, 109, 71, 0.5)",
    backgroundColor: "transparent",
  },
  // hover 状态：轻放大 + 颜色变亮 + 背景出现
  hover: {
    scale: 1.05,
    color: "rgba(139, 109, 71, 0.8)",
    backgroundColor: "rgba(139, 109, 71, 0.05)",
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
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

// Icon 跳跃动画：配合按钮使用
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

// 旋转动画：用于重新连接和加载状态
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
