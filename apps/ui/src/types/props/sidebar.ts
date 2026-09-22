// apps/ui/src/types/props/sidebar.ts
import type { NavigationState } from "../state";

/** Props for the sidebar.
 *
 * 侧边栏的属性。
 */
export type SidebarProps = Pick<
  NavigationState,
  "activeNavId" | "setActiveNavId"
>;
