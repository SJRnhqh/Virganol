// apps/ui/src/components/settings/SettingsModal.tsx
import { AnimatePresence, motion } from "framer-motion";

import { cn, modalBackdrop, paperUnfoldVariants } from "@/lib";
import { useSettingsStore } from "@/store";
import { PanelBoard } from "./panels";
import { SettingsSidebar } from "./sidebar";

export const SettingsModal = () => {
  const { isOpen, close } = useSettingsStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center isolate">
          {/* 遮罩 */}
          <motion.div
            animate="visible"
            className="absolute inset-0 bg-settings-outlay"
            exit="exit"
            initial="hidden"
            onClick={close}
            variants={modalBackdrop}
          />

          {/* 纸张容器：3D 展开 */}
          <motion.div
            animate="visible"
            className={cn(
              "relative flex overflow-hidden origin-center",
              "w-220 h-160",
              "rounded-3xl shadow-3xl",
            )}
            exit="exit"
            initial="hidden"
            variants={paperUnfoldVariants}
          >
            <SettingsSidebar />
            <PanelBoard />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
