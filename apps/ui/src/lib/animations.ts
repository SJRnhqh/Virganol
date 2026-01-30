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
      duration: 0,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1.2,
    },
  },
};
// 2. 纸张容器 (父级)：完美的"起"与"落"
export const paperUnfoldVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    rotateX: 45,
    y: 80,
    filter: "blur(10px)", // 深度模糊，增加梦幻感
    transformPerspective: 1500,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      // 🐢 1.2秒 入场
      duration: 1.2,
      // 🌊 极度平滑的曲线：大部分时间都在做最后的微调归位
      ease: [0.19, 1, 0.22, 1] as const,

      // 彻底同步
      when: "start",
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
  // 🟢 关键：退出动画 (原路返回 / 归位)
  exit: {
    opacity: 0,
    scale: 0.92, // 慢慢缩回去
    rotateX: 45,
    y: 60, // 向下沉
    filter: "blur(10px)",
    transition: {
      // 🐢 1.2秒 离场 (保持一致的慢节奏)
      duration: 1.2,
      // 🍂 离场曲线：先慢后快再慢，像一片叶子落下
      ease: [0.3, 0, 0.2, 1] as const,

      // 同步
      staggerChildren: 0,
    },
  },
};

/* === 2. Settings Tab 面板切换动画 === */
// 更自然的面板切换：轻微位移 + 模糊 + 弹性曲线
export const panelSwitchVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 16,
    scale: 0.995,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 24,
      mass: 0.9,
    },
  },
  exit: {
    opacity: 0,
    x: -16,
    scale: 0.995,
    filter: "blur(6px)",
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 26,
      mass: 0.9,
    },
  },
};
