// apps/ui/src/hooks/hotkeys/useKeyboardShortcuts.ts
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { useSettingsStore, useSidebarStore } from "@/store";
import { handleKeyDown } from "./handleKeyDown";

/** Manages the global keyboard shortcut listener.
 *
 * 管理全局键盘快捷键监听。
 */
export function useKeyboardShortcuts() {
  const { isOpen, open, close } = useSettingsStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      open: state.open,
      close: state.close,
    })),
  );
  const { toggle, toggleSide } = useSidebarStore(
    useShallow((state) => ({
      toggle: state.toggle,
      toggleSide: state.toggleSide,
    })),
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) =>
      handleKeyDown(event, {
        settings: { isOpen, open, close },
        sidebar: { toggle, toggleSide },
      });

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, open, close, toggle, toggleSide]);
}
