// apps/ui/src/types/state/sidebar.ts
import type { DisclosureState } from "./disclosure";

/** Sidebar state.
 *
 * 侧边栏状态。
 */
export interface SidebarState extends DisclosureState {
  /** The id of the active navigation item.
   *
   * 当前激活的导航项标识。
   */
  activeId: string;
  /** Sets the active navigation id.
   *
   * 设置激活的导航项标识。
   */
  setActiveId: (id: string) => void;
  /** The docking side of the sidebar.
   *
   * 侧边栏的停靠侧。
   */
  side: "left" | "right";
  /** Toggles the docking side.
   *
   * 切换停靠侧。
   */
  toggleSide: () => Promise<void>;
  /** Whether a side switch is in progress.
   *
   * 停靠侧切换是否进行中。
   */
  isSwitching: boolean;
}
