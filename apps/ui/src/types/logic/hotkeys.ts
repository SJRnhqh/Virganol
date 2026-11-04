// apps/ui/src/types/logic/hotkeys.ts
import type { SettingsState, SidebarState } from "../state";

/** Dependencies of the global shortcut dispatcher.
 *
 * 全局快捷键分发器的依赖。
 */
export interface ShortcutDeps {
  settings: SettingsShortcutDeps;
  sidebar: SidebarShortcutDeps;
}

/** Dependencies of the settings shortcut handler.
 *
 * 设置快捷键处理器的依赖。
 */
export type SettingsShortcutDeps = Pick<
  SettingsState,
  "isOpen" | "open" | "close"
>;

/** Dependencies of the sidebar shortcut handler.
 *
 * 侧边栏快捷键处理器的依赖。
 */
export type SidebarShortcutDeps = Pick<SidebarState, "toggle" | "toggleSide">;
