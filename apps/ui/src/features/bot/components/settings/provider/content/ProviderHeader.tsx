// apps/ui/src/features/bot/components/settings/provider/content/ProviderHeader.tsx
// 外部依赖
import { RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// 内部引用
import {
  cn,
  phaseIconVariants,
  pulseIconVariants,
  refreshButtonVariants,
} from "@/lib";
import { PROVIDER_CHECK_PHASES } from "@/features/bot/constants";
import { PHASE_CLOUD_ICONS } from "@/features/bot/icons";
import { useProviderCheckStore } from "@/features/bot/store";
import { triggerProviderManualRefresh } from "@/features/bot/api";

export const ProviderHeader = () => {
  const phase = useProviderCheckStore((s) => s.phase);
  const isChecking = phase === PROVIDER_CHECK_PHASES.CHECKING;
  const PhaseIcon = PHASE_CLOUD_ICONS[phase];

  return (
    <div className="mb-3 px-1 flex items-center justify-between">
      <h2 className="text-lg font-bold tracking-tight">LLM Providers</h2>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            variants={phaseIconVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isChecking ? (
              <motion.div variants={pulseIconVariants} animate="pulsing">
                <PhaseIcon className="w-5 h-5 text-settings-panel-fg/40" />
              </motion.div>
            ) : (
              <PhaseIcon className="w-5 h-5 text-settings-panel-fg/40" />
            )}
          </motion.div>
        </AnimatePresence>
        <motion.button
          type="button"
          variants={refreshButtonVariants}
          initial="idle"
          whileTap={isChecking ? undefined : "tap"}
          disabled={isChecking}
          onClick={() => triggerProviderManualRefresh()}
          className={cn(
            // 基础样式
            "p-1 rounded-md transition-colors cursor-pointer",
            // 默认颜色
            "text-settings-panel-fg/40",
            "hover:bg-settings-panel-fg/8 hover:text-settings-panel-fg/70",
            // 禁用状态
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "disabled:hover:bg-transparent disabled:hover:text-settings-panel-fg/40"
          )}
        >
          <RefreshCw className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
