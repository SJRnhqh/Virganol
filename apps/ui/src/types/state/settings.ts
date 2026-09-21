// apps/ui/src/types/state/settings.ts
import type { DisclosureState } from "./disclosure";
import type { SettingsTab } from "../settings";

/** Settings state.
 *
 * 设置状态。
 */
export interface SettingsState extends DisclosureState {
  /** The active settings tab.
   *
   * 当前激活的设置页签。
   */
  activeTab: SettingsTab;
  /** Sets the active settings tab.
   *
   * 设置激活的设置页签。
   */
  setTab: (tab: SettingsTab) => void;
}
