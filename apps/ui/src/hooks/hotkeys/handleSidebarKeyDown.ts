// apps/ui/src/hooks/hotkeys/handleSidebarKeyDown.ts
import type { SidebarShortcutDeps } from "@/types";

/** Handles sidebar shortcuts.
 *
 * 处理侧边栏快捷键。
 */
export function handleSidebarKeyDown(
  event: KeyboardEvent,
  isMod: boolean,
  key: string,
  deps: SidebarShortcutDeps
): boolean {
  if (!isMod || event.shiftKey) return false;

  switch (key) {
    case "b":
      event.preventDefault();
      deps.toggle();
      return true;

    case "e":
      event.preventDefault();
      deps.toggleSide();
      return true;

    default:
      return false;
  }
}
