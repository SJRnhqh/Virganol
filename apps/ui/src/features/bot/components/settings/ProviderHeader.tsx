// apps/ui/src/features/bot/components/settings/ProviderHeader.tsx
// 外部依赖
import { Cloud, CloudAlert, CloudCheck, CloudCog, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// 内部引用
import { useProviderCheckStore } from "@/features/bot/store";
import { phaseIconVariants, pulseIconVariants } from "@/lib/animations";

export const ProviderHeader = () => {
  const phase = useProviderCheckStore((s) => s.phase);

  return (
    <div className="mb-3 px-1 flex items-center justify-between">
      <h2 className="text-lg font-bold tracking-tight">LLM Providers</h2>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle" variants={phaseIconVariants} initial="hidden" animate="visible" exit="exit">
              <Cloud className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
          {phase === "checking" && (
            <motion.div key="checking" variants={phaseIconVariants} initial="hidden" animate="visible" exit="exit">
              <motion.div variants={pulseIconVariants} animate="pulsing">
                <CloudCog className="w-5 h-5 text-settings-panel-fg/40" />
              </motion.div>
            </motion.div>
          )}
          {phase === "done" && (
            <motion.div key="done" variants={phaseIconVariants} initial="hidden" animate="visible" exit="exit">
              <CloudCheck className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
          {phase === "failed" && (
            <motion.div key="failed" variants={phaseIconVariants} initial="hidden" animate="visible" exit="exit">
              <CloudAlert className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          className="p-0.5 rounded text-settings-panel-fg/40 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
