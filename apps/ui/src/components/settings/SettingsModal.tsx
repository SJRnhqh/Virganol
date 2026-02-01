// apps/ui/src/components/settings/SettingsModal.tsx
// 外部依赖
import { motion, AnimatePresence } from "framer-motion";

// 内部引用
import { cn, modalBackdrop, paperUnfoldVariants } from "@/lib";
import { SettingsSidebar } from "./sidebar/SettingsSidebar";
import { PanelBoard } from "@/components/settings/panels";
import { useSettingsStore } from "@/store/SettingsStore";

export const SettingsModal = () => {
  const { isOpen, closeSettings } = useSettingsStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center isolate">
          {/* 遮罩 */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-settings-outlay"
            onClick={closeSettings}
          />

          {/* 纸张容器：3D 展开 */}
          <motion.div
            variants={paperUnfoldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative flex overflow-hidden origin-center",
              "w-220 h-160",
              "rounded-3xl shadow-3xl",
            )}
          >
            <SettingsSidebar />
            <PanelBoard />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
