import { useEffect } from "react";
import { useSidebarStore } from "@/store/SidebarStore";
import { NAV_ITEMS } from "@/config/navigation";

/**
 * ⌨️ Virganol 全局快捷键调度中心
 * 核心原则：集中管理、静默拦截、输入感知
 */
export function useKeyboardShortcuts() {
  const { toggle, toggleSide, setActiveId } = useSidebarStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. 输入过滤：如果焦点在输入框，不触发全局快捷键
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isInput) return;

      // 2. 跨平台检测：Mac 用 Meta (⌘)，Windows/Linux 用 Ctrl
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
      const mainKey = isMac ? event.metaKey : event.ctrlKey;
      const shiftKey = event.shiftKey;
      const key = event.key.toLowerCase();

      // --- 指令分发 ---

      // 🟢 侧边栏收放: [Cmd/Ctrl] + B
      if (mainKey && !shiftKey && key === "b") {
        event.preventDefault();
        toggle();
      }

      // 🟢 左右位置镜像切换: [Cmd/Ctrl] + E
      // 采用你最新的定义，赋予位置切换更清脆的响应
      if (mainKey && !shiftKey && key === "e") {
        event.preventDefault();
        toggleSide();
      }

      // 🟢 模块快速切换: [Cmd/Ctrl] + [1-7]
      // 自动映射导航栏的前 7 个模块
      if (mainKey && !shiftKey && /^[1-7]$/.test(key)) {
        const index = parseInt(key) - 1;
        const targetModule = NAV_ITEMS[index];
        
        if (targetModule) {
          event.preventDefault();
          setActiveId(targetModule.id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggle, toggleSide, setActiveId]);
}