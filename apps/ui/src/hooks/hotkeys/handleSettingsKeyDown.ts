// apps/ui/src/hooks/hotkeys/handleSettingsKeyDown.ts
import type { SettingsShortcutDeps } from "@/types";

/** Handles settings shortcuts.
 *
 * 处理设置快捷键。
 */
export function handleSettingsKeyDown(
  event: KeyboardEvent,
  isMod: boolean,
  key: string,
  deps: SettingsShortcutDeps
): boolean {
  switch (key) {
    case ",":
      if (!isMod) return false;
      event.preventDefault();
      (!deps.isOpen ? deps.open : deps.close)();
      return true;

    case "escape":
      if (!deps.isOpen) return false;
      event.preventDefault();
      event.stopPropagation();
      deps.close();
      return true;

    default:
      return false;
  }
}
