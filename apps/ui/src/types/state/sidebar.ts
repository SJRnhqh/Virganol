// apps/ui/src/types/state/sidebar.ts
import type { DisclosureState } from "./disclosure";

/** Sidebar state.
 *
 * 侧边栏状态。
 */
export interface SidebarState extends DisclosureState {
  /** The docking side of the sidebar.
   *
   * 侧边栏的停靠侧。
   */
  side: "left" | "right";
  /** Toggles the docking side.
   *
   * 切换停靠侧。
   */
  toggleSide: () => void;
}
