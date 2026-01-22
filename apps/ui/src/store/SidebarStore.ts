import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  side: "left" | "right";
  isSwitching: boolean; // 🟢 关键：标记是否正处于位置切换中

  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
  
  toggleSide: () => Promise<void>; // 🟢 改为异步 Action
  setSide: (side: "left" | "right") => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      side: "left",
      isSwitching: false,

      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setOpen: (isOpen) => set({ isOpen }),

      /**
       * ↔️ 极客式异步切换逻辑
       * 流程：开启消隐 -> 等待 -> 翻转位置 -> 恢复显现
       */
      toggleSide: async () => {
        if (get().isSwitching) return; // 防止连续点击导致逻辑混乱

        // 1. 启动消隐：内胆 Opacity 开始降为 0
        set({ isSwitching: true });

        // 2. 等待消隐完成 (配合 CSS transition 约 80-100ms)
        // 这个时间足以让眼睛察觉到变淡，但又不会觉得慢
        await new Promise((resolve) => setTimeout(resolve, 80));

        // 3. 瞬间镜像翻转位置，并关闭切换标记（触发内容显现）
        set((state) => ({
          side: state.side === "left" ? "right" : "left",
          isSwitching: false,
        }));
      },

      setSide: (side) => set({ side }),
    }),
    {
      name: "virganol-sidebar-storage",
      // 🟢 极客细节：只持久化侧边栏的开关和位置，不持久化切换中的临时状态
      partialize: (state) => ({
        isOpen: state.isOpen,
        side: state.side,
      }),
    }
  )
);