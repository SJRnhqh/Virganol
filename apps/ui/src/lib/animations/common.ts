// apps/ui/src/lib/animations/common.ts
// 外部依赖
import type { Variants } from "framer-motion";

/* === 通用动画 === */

// 脉冲呼吸动画：用于表达"加载中/处理中"状态的明暗交替效果
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
