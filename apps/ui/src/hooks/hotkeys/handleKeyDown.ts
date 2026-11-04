// apps/ui/src/hooks/hotkeys/handleKeyDown.ts
import type { ShortcutDeps } from "@/types";
import { handleSettingsKeyDown } from "./handleSettingsKeyDown";
import { handleSidebarKeyDown } from "./handleSidebarKeyDown";

/** Dispatches global keyboard shortcuts.
 *
 * 分发全局键盘快捷键。
 */
export function handleKeyDown(event: KeyboardEvent, deps: ShortcutDeps) {
  const target = event.target;
  const isEditable =
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable);
  if (isEditable) return;

  const { isMod, key } = normalizeShortcutKey(event);

  if (handleSettingsKeyDown(event, isMod, key, deps.settings)) return;
  handleSidebarKeyDown(event, isMod, key, deps.sidebar);
}

/** Normalizes shortcut input.
 *
 * 规范化快捷键输入。
 */
function normalizeShortcutKey(event: KeyboardEvent) {
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const isMod = isMac ? event.metaKey : event.ctrlKey;
  const key = event.key.toLowerCase();

  return { isMod, key };
}
