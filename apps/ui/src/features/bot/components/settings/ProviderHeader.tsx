// apps/ui/src/features/bot/components/settings/ProviderHeader.tsx
// 外部依赖
import {
  Cloud,
  CloudAlert,
  CloudCheck,
  CloudCog,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// 内部引用
import { useProviderCheckStore } from "@/features/bot/store";
import { triggerProviderManualRefresh } from "@/features/bot/api";
import {
  phaseIconVariants,
  pulseIconVariants,
  refreshButtonVariants,
} from "@/lib/animations";

export const ProviderHeader = () => {
  const phase = useProviderCheckStore((s) => s.phase);
  const isChecking = phase === "checking";

  return (
    <div className="mb-3 px-1 flex items-center justify-between">
      <h2 className="text-lg font-bold tracking-tight">LLM Providers</h2>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              variants={phaseIconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Cloud className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
          {phase === "checking" && (
            <motion.div
              key="checking"
              variants={phaseIconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div variants={pulseIconVariants} animate="pulsing">
                <CloudCog className="w-5 h-5 text-settings-panel-fg/40" />
              </motion.div>
            </motion.div>
          )}
          {phase === "done" && (
            <motion.div
              key="done"
              variants={phaseIconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CloudCheck className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
          {phase === "degraded" && (
            <motion.div
              key="degraded"
              variants={phaseIconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CloudAlert className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
          {phase === "failed" && (
            <motion.div
              key="failed"
              variants={phaseIconVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <CloudOff className="w-5 h-5 text-settings-panel-fg/40" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          variants={refreshButtonVariants}
          initial="idle"
          whileTap={isChecking ? undefined : "tap"}
          disabled={isChecking}
          onClick={() => triggerProviderManualRefresh()}
          className="p-1 rounded-md text-settings-panel-fg/40 hover:bg-settings-panel-fg/8 hover:text-settings-panel-fg/70 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-settings-panel-fg/40"
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
