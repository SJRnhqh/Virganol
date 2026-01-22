import React from "react";
import { motion } from "framer-motion";

export function NavIndicator() {
  return (
    <motion.div
      layoutId="active-pill"
      /**
       * 🎨 颜色语义化重构
       * 1. bg-sidebar-active-bg: 对应主题中的米色 (Parchment)
       * 2. shadow: 使用 Tailwind 主题映射的变量
       */
      className="absolute -right-3 w-1 h-7 bg-sidebar-active-bg rounded-l-full z-50 shadow-[0_0_10px_var(--color-sidebar-active-bg)]"
      // 🚀 物理反馈参数严格保持原样，没有任何迟滞
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 40,
        mass: 0.2,
      }}
    />
  );
}
