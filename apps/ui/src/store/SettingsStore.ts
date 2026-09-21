// apps/ui/src/store/SettingsStore.ts
import { create } from "zustand";

import { DEFAULT_SETTINGS_TAB, type SettingsState } from "@/types";

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
