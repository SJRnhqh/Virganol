// apps/ui/src/hooks/hotkeys/useKeyboardShortcuts.ts
import { useEffect } from "react";

import { useSettingsStore, useSidebarStore } from "@/store";
import { handleKeyDown } from "./handleKeyDown";

/** Registers the global keyboard shortcuts.
 *
 * 注册全局键盘快捷键。
 */
export function useKeyboardShortcuts() {
  const {
    isOpen: isSettingsOpen,
    closeSettings,
    openSettings,
  } = useSettingsStore();
  const { toggle, toggleSide } = useSidebarStore();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) =>
      handleKeyDown(event, {
        isSettingsOpen,
        closeSettings,
        openSettings,
        toggle,
        toggleSide,
      });

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle, toggleSide, isSettingsOpen, closeSettings, openSettings]);
}
