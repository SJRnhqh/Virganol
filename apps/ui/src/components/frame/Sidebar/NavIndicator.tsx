import React from "react";
import { motion } from "framer-motion";

export function NavIndicator() {
  return (
    <motion.div
      layoutId="active-pill"
      className="absolute -right-3 w-1 h-7 bg-sidebar-active-bg rounded-l-full z-50 shadow-[0_0_10px_var(--sidebar-active-bg)]"
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 40, 
        mass: 0.2 
      }}
    />
  );
}