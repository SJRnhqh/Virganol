// apps/ui/src/types/state/settings.ts
import type { SettingsTab } from "../settings";

/** Settings state.
 *
 * 设置状态。
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
