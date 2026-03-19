// apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderResetButton.tsx
// 外部依赖
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

// 内部引用
import { cn, providerButtonVariants } from "@/lib";
import type { ProviderResetButtonProps } from "@/features/bot/types";

export const ProviderResetButton = ({ onClick }: ProviderResetButtonProps) => {
  return (
    <motion.button
      type="button"
      variants={providerButtonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      onClick={() => {
        void onClick?.();
      }}
      className={cn(
        "group flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        "text-settings-panel-error/70 hover:text-settings-panel-error",
        "hover:bg-settings-panel-error/8 transition-all duration-200",
      )}
    >
      <RotateCcw className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-rotate-90" />
      Reset
    </motion.button>
  );
};
