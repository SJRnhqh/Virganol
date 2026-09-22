// apps/ui/src/store/NavigationStore.ts
import { create } from "zustand";

import { NAV_ITEMS } from "@/constants";
import type { NavigationState } from "@/types";

/** State container of the workbench navigation.
 *
 * 工作台导航的状态容器。
 */
export const useNavigationStore = create<NavigationState>((set) => ({
  activeNavId: NAV_ITEMS[0].id,
  setActiveNavId: (navId) => set({ activeNavId: navId }),
}));
