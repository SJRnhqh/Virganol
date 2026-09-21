// apps/ui/src/types/state/settings.ts
import type { SettingsTab } from "@/types";

/** Shape of the settings store.
 *
 * 设置状态容器的形态。
 */
export interface SettingsState {
  // ---- State ----
  isOpen: boolean;
  activeTab: SettingsTab;

  // ---- Actions ----
  openSettings: (tab?: SettingsTab) => void;
  closeSettings: () => void;
  setTab: (tab: SettingsTab) => void;
}
