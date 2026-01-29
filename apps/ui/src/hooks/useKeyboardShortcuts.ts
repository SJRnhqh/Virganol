import { useEffect } from "react";
import { useSidebarStore, useSettingsStore } from "@/store";
import { NAV_ITEMS } from "@/constants/navigation";

/**
 * ⌨️ Virganol 全局快捷键调度中心
 * 核心原则：集中管理、静默拦截、输入感知
 */
export function useKeyboardShortcuts() {
  const { toggle, toggleSide, setActiveId } = useSidebarStore();
  const {
    isOpen: isSettingsOpen,
    closeSettings,
    openSettings,
  } = useSettingsStore();

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

      // === 第一层级：绝对全局快捷键 (不受输入框焦点限制) ===

      // 🔴 ESC 关闭设置 (从 SettingsModal 移过来的逻辑)
      // 逻辑：如果设置面板打开了，按 ESC 应该优先关闭它，无论焦点在哪里
      if (key === "escape" && isSettingsOpen) {
        event.preventDefault();
        event.stopPropagation(); // 防止冒泡
        closeSettings();
        return; // 阻止后续处理
      }

      // ⚙️ 打开/关闭设置: [Cmd/Ctrl] + [,]
      // 这是业界标准快捷键 (VS Code, Mac Apps 等)
      if (mainKey && key === ",") {
        event.preventDefault();
        if (isSettingsOpen) {
          closeSettings();
        } else {
          openSettings();
        }
        return;
      }

      // === 第二层级：输入敏感快捷键 (如果在打字，则不触发) ===

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
  }, [
    toggle,
    toggleSide,
    setActiveId,
    isSettingsOpen,
    closeSettings,
    openSettings,
  ]);
}
