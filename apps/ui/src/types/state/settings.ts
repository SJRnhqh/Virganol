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
  /** Activates a settings tab.
   *
   * 切换设置页签。
   */
  setTab: (tab: SettingsTab) => void;
}
