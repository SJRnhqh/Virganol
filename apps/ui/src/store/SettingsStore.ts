// apps/ui/src/store/SettingsStore.ts
import { create } from "zustand";
import { DEFAULT_SETTINGS_TAB, type SettingsTab } from "../types/settings";

// Settings 运行时状态：只管理打开/关闭与当前激活的 Tab
interface SettingsState {
  // ---- State ----
  isOpen: boolean;
  activeTab: SettingsTab;

  // ---- Actions ----
  // 打开设置 (可传入目标 Tab 实现自动跳转)
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  setTab: (tab: SettingsTab) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isOpen: false,
  activeTab: DEFAULT_SETTINGS_TAB, // 默认进通用

  openSettings: (tab) =>
    set(() => ({
      isOpen: true,
      // 如果没传 tab，默认去 general；传了就去对应的模块设置
      activeTab: tab || DEFAULT_SETTINGS_TAB,
    })),

  closeSettings: () => set({ isOpen: false }),

  setTab: (tab) => set({ activeTab: tab }),
}));
