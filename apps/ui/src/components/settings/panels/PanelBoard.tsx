// apps/ui/src/components/settings/panels/PanelBoard.tsx
import { motion } from "framer-motion";
import { SpiritPanel } from "./SpiritPanel";
import { ComingSoonPanel } from "./ComingSoonPanel";
import { useSettingsStore } from "@/store/SettingsStore";
import type { ReactElement } from "react";
import { panelSwitchVariants } from "@/lib";
import { SETTINGS_TABS, type PanelType } from "@/constants/settings";
import { Monitor, type LucideIcon } from "lucide-react";

export const PanelBoard = () => {
  const activeTab = useSettingsStore((state) => state.activeTab);

  const currentTabInfo = SETTINGS_TABS.find((t) => t.id === activeTab);

  // 根据配置的 panelType 动态渲染面板组件
  const renderPanel = (
    panelType: PanelType,
    displayName?: string,
    icon?: LucideIcon,
  ): ReactElement => {
    switch (panelType) {
      case "spirit":
        return <SpiritPanel />;
      default:
        return (
          <ComingSoonPanel
            name={displayName || "Unknown"}
            icon={icon || Monitor}
          />
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-settings-panel-bg relative z-0">
      {/* Panel Content */}
      <div className="flex-1 overflow-hidden p-8">
        <div className="h-full">
          <motion.div
            className="h-full"
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
                currentTabInfo.icon,
              )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};