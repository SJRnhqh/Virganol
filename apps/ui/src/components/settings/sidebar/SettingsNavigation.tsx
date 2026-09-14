// apps/ui/src/components/settings/sidebar/SettingsNavigation.tsx
import { motion } from "framer-motion";

import { SETTINGS_TABS } from "@/constants";
import { useSettingsStore } from "@/store";
import { SettingsNavItem } from "./SettingsNavItem";

export const SettingsNavigation = () => {
  const { activeTab, setTab } = useSettingsStore();

  return (
    <motion.nav className="flex-1 px-3 space-y-1.5">
      {SETTINGS_TABS.map((tab) => (
        <SettingsNavItem
          key={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.id}
          onClick={() => setTab(tab.id)}
        />
      ))}
    </motion.nav>
  );
};
