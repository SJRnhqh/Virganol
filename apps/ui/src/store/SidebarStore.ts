// apps/ui/src/store/SidebarStore.ts
import { create } from "zustand";

import { type SidebarState } from "@/types";

export const useSidebarStore = create<SidebarState>((set, get) => ({
  // --- 初始状态 ---
  isOpen: true,
  side: "left",
  activeId: "scispirit",
  isSwitching: false,

  // --- 基础动作 ---
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  setOpen: (isOpen) => set({ isOpen }),

  setActiveId: (id: string) => set({ activeId: id }),

  /**
   * ↔️ 极客式异步切换逻辑
   * 流程：开启消隐 -> 等待布局重组 -> 恢复显现
   */
  toggleSide: async () => {
    if (get().isSwitching) return; // 防抖

    // 1. 启动消隐：内胆 Opacity 开始降为 0
    set({ isSwitching: true });

    // 2. 等待消隐完成 (配合 CSS transition 约 80ms)
    await new Promise((resolve) => setTimeout(resolve, 80));

    // 3. 瞬间镜像翻转位置，并关闭切换标记（触发内容浮现）
    set((state) => ({
      side: state.side === "left" ? "right" : "left",
      isSwitching: false,
    }));
  },

  setSide: (side) => set({ side }),
}));
