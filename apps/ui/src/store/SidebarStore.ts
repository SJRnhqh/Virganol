// apps/ui/src/store/SidebarStore.ts
import { create } from "zustand";

import type { SidebarState } from "@/types";
import { createDisclosure } from "./createDisclosure";

/** State container of the sidebar.
 *
 * 侧边栏的状态容器。
 */
export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true,
  ...createDisclosure(set),

  side: "left",
  toggleSide: () =>
    set((state) => ({
      side: state.side === "left" ? "right" : "left",
    })),
}));
