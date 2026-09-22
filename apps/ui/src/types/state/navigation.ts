// apps/ui/src/types/state/navigation.ts
import type { NavId } from "../navigation";

/** Workbench navigation state.
 *
 * 工作台导航状态。
 */
export interface NavigationState {
  /** Active navigation item identifier.
   *
   * 当前导航项标识。
   */
  activeNavId: NavId;
  /** Sets the active navigation item.
   *
   * 设置当前导航项。
   */
  setActiveNavId: (navId: NavId) => void;
}
