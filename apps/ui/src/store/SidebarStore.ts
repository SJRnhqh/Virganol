import { create } from "zustand";
import { persist } from "zustand/middleware"; // 选装：如果你希望刷新后记住位置

interface SidebarState {
  isOpen: boolean;
  side: "left" | "right"; // 🟢 新增：位置状态
  
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
  
  // 🟢 新增：切换左右位置的 Action (为未来预留)
  toggleSide: () => void;
  setSide: (side: "left" | "right") => void;
}

export const useSidebarStore = create<SidebarState>()(
  // 使用 persist 确保用户习惯被记住 (可选)
  persist(
    (set) => ({
      isOpen: true,
      side: "left", // 默认在左边

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (isOpen) => set({ isOpen }),

      toggleSide: () => set((state) => ({ 
        side: state.side === "left" ? "right" : "left" 
      })),
      setSide: (side) => set({ side }),
    }),
    {
      name: "virganol-sidebar-storage", // localStorage key
    }
  )
);