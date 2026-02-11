// apps/ui/src/components/settings/panels/PanelBoard.tsx
// 外部依赖
import { Monitor, type LucideIcon } from "lucide-react";
import type { ReactElement } from "react";

// 内部引用
import { SETTINGS_TABS, type PanelType } from "@/constants";
import { useSettingsStore } from "@/store";

import { ComingSoonPanel } from "./ComingSoonPanel";
import { SpiritPanel } from "./SpiritPanel";

export const PanelBoard = () => {
  const activeTab = useSettingsStore((state) => state.activeTab);
  const currentTabInfo = SETTINGS_TABS.find((t) => t.id === activeTab);

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
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-settings-panel-bg relative z-0">
      {/* Panel Content */}
      <div className="flex-1 min-h-0 overflow-y-auto p-8 settings-panel-scroll">
        {currentTabInfo &&
          renderPanel(
            currentTabInfo.panelType,
            currentTabInfo.panelDisplayName,
            currentTabInfo.icon,
          )}
      </div>
    </div>
  );
};
