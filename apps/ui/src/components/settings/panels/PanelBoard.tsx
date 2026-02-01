// apps/ui/src/components/settings/panels/PanelBoard.tsx
import { SpiritPanel } from "./SpiritPanel";
import { ComingSoonPanel } from "./ComingSoonPanel";
import { useSettingsStore } from "@/store/SettingsStore";
import type { ReactElement } from "react";
import { SETTINGS_TABS, type PanelType } from "@/constants/settings";
import { Monitor, type LucideIcon } from "lucide-react";

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
