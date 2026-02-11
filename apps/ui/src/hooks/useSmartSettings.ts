import { useSettingsStore } from "../store/SettingsStore";
import { DEFAULT_SETTINGS_TAB, type SettingsTab } from "../types/settings";
import { useSidebarStore } from "../store/SidebarStore";
import { NAV_ITEMS } from "../constants/navigation"; // 👈 直接引入导航配置

export function useSmartSettings() {
  const openSettings = useSettingsStore((state) => state.openSettings);
  const activeNavId = useSidebarStore((state) => state.activeId);

  /**
   * 智能打开设置：自动根据当前上下文定位到对应 Tab
   */
  const openContextAwareSettings = () => {
    // 1. 查找当前激活的 Sidebar ID 是否存在于导航配置中
    const isNavModule = NAV_ITEMS.some((item) => item.id === activeNavId);

    // 2. 如果存在，且我们约定了 Sidebar ID === Settings Tab ID，直接透传
    //    如果当前不在任何模块中（比如在 Welcome 页），则回退到 'general'
    let targetTab: SettingsTab = DEFAULT_SETTINGS_TAB;

    if (isNavModule) {
      // 这里做一个简单的类型断言，因为我们的架构约定了 ID 一致性
      // 如果你担心类型安全，可以在 navigation.ts 里把 id 定义得更严格
      targetTab = activeNavId as SettingsTab;
    }

    // 3. 打开设置
    openSettings(targetTab);
  };

  return {
    openContextAwareSettings,
  };
}
