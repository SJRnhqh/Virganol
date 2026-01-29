// apps/ui/src/components/settings/sidebar/SettingsSidebar.tsx
// TODO: 美化重构
import { motion } from "framer-motion";
import { SETTINGS_TABS } from "@/constants/settings";
import { cn, contentFadeUp, containerStagger } from "@/lib";
import type { SettingsTab } from "@/store/SettingsStore";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  setTab: (tab: SettingsTab) => void;
}

export const SettingsSidebar = ({
  activeTab,
  setTab,
}: SettingsSidebarProps) => {
  return (
    <motion.div
      variants={containerStagger}
      className={cn(
        // 1. 布局与尺寸
        "w-60 flex flex-col py-6 z-10",

        // 2. 颜色与材质 (关键修复)
        // 使用专门的变量 --settings-sidebar-bg，不再使用 /50 透明度
        // 这样可以确保颜色是纯净的，不会因为叠加了底色而显得“脏”
        "bg-settings-sidebar",

        // 3. 边框 (右侧分割线)
        "border-r border-slate-200 dark:border-[#333]",
      )}
    >
      {/* 标题区域 */}
      <motion.div variants={contentFadeUp} className="px-6 mb-6">
        <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Settings
        </h2>
      </motion.div>

      {/* 导航列表 */}
      <motion.div variants={contentFadeUp} className="flex-1 px-3 space-y-1">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-white dark:bg-[#37373d] text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-slate-200 dark:ring-[#444]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5",
              )}
            >
              <Icon
                className={cn(
                  "w-4.5 h-4.5",
                  isActive ? "text-blue-500" : "text-slate-400",
                )}
              />
              {tab.label}
            </button>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
