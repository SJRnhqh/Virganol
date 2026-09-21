// apps/ui/src/store/SidebarStore.ts
import { create } from "zustand";

import { type SidebarState } from "@/types";
import { createDisclosure } from "./createDisclosure";

/** State container of the sidebar.
 *
 * 侧边栏的状态容器。
 */
export const useSidebarStore = create<SidebarState>((set, get) => ({
  isOpen: true,
  ...createDisclosure(set),

  activeId: "scispirit",
  setActiveId: (id: string) => set({ activeId: id }),

  side: "left",
  toggleSide: async () => {
    if (get().isSwitching) return;

    set({ isSwitching: true });

    await new Promise((resolve) => setTimeout(resolve, 80));

    set((state) => ({
      side: state.side === "left" ? "right" : "left",
      isSwitching: false,
    }));
  },

  isSwitching: false,
}));
