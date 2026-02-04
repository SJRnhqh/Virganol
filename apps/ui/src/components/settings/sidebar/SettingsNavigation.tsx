// apps/ui/src/components/settings/sidebar/SettingsNavigation.tsx
// 外部依赖
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

// 内部引用
import { SettingsNavItem } from "@/components/settings/sidebar";
import { useSettingsStore } from "@/store";
import { type SettingsTab } from "@/types";
import { SETTINGS_TABS } from "@/constants";

export const SettingsNavigation = () => {
  const { activeTab, setTab } = useSettingsStore();

  return (
    <motion.nav className="flex-1 px-3 space-y-1.5">
      {SETTINGS_TABS.map((tab) => (
        <SettingsNavItem
          key={tab.id}
          label={tab.label}
          icon={tab.icon as LucideIcon}
          isActive={activeTab === tab.id}
          onClick={() => setTab(tab.id as SettingsTab)}
        />
      ))}
    </motion.nav>
  );
};
