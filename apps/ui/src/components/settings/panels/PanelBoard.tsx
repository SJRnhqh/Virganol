// apps/ui/src/components/settings/panels/PanelBoard.tsx
import { motion } from "framer-motion";
import { GeneralPanel } from "./GeneralPanel";
import { SpiritPanel } from "./SpiritPanel";
import { ComingSoonPanel } from "./ComingSoonPanel";
import { useSettingsStore } from "@/store/SettingsStore";
import type { ReactElement } from "react";
import { panelSwitchVariants } from "@/lib";
import { SETTINGS_TABS, type PanelType } from "@/constants/settings";

export const PanelBoard = () => {
  const activeTab = useSettingsStore((state) => state.activeTab);

  const currentTabInfo = SETTINGS_TABS.find((t) => t.id === activeTab);

  // 根据配置的 panelType 动态渲染面板组件
  const renderPanel = (
    panelType: PanelType,
    displayName?: string,
  ): ReactElement => {
    switch (panelType) {
      case "general":
        return <GeneralPanel />;
      case "spirit":
        return <SpiritPanel />;
      case "comingSoon":
        return <ComingSoonPanel name={displayName || "Unknown"} />;
      default:
        return <ComingSoonPanel name="Unknown" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-settings-panel-bg relative z-0">
      {/* Header */}
      {/*<div className="h-16 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm">
        <motion.div key={currentTabInfo?.label}>
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {currentTabInfo?.label || "Unknown"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your configuration for {currentTabInfo?.label}
          </p>
        </motion.div>
      </div>*/}

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl">
          <motion.div
            key={activeTab}
            variants={panelSwitchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentTabInfo &&
              renderPanel(
                currentTabInfo.panelType,
                currentTabInfo.panelDisplayName,
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
