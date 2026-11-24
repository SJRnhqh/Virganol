// apps/ui/src/store/SettingsStore.ts
import { create } from "zustand";

import type { SettingsState } from "@/types";
import { DEFAULT_SETTINGS_TAB } from "@/constants";
import { createDisclosure } from "./createDisclosure";

/** State container of the settings.
 *
 * 设置的状态容器。
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  isOpen: false,
  ...createDisclosure(set),

  activeTab: DEFAULT_SETTINGS_TAB,
  setTab: (tab) => set({ activeTab: tab }),
}));
