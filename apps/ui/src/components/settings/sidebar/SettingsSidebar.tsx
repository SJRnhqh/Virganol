// apps/ui/src/components/settings/sidebar/SettingsSidebar.tsx
// 外部依赖
import { motion } from "framer-motion";

// 内部引用
import { cn } from "@/lib";

import { SettingsNavigation } from "./SettingsNavigation";

export const SettingsSidebar = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={cn("w-60 flex flex-col py-8 z-10", "bg-settings-sidebar")}
    >
      <motion.div className="px-7 mb-6">
        <h2
          className={cn(
            "text-xl font-semibold text-settings-sidebar-fg tracking-tight",
          )}
        >
          Settings
        </h2>
      </motion.div>

      <SettingsNavigation />
    </motion.div>
  );
};
