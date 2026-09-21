// apps/ui/src/types/state/sidebar.ts

/** Shape of the sidebar store.
 *
 * 侧边栏状态容器的形态。
 */
export interface SidebarState {
  // 状态
  isOpen: boolean;
  side: "left" | "right";
  activeId: string;
  isSwitching: boolean;

  // 动作
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
  setActiveId: (id: string) => void;
  toggleSide: () => Promise<void>;
  setSide: (side: "left" | "right") => void;
}
