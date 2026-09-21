// apps/ui/src/hooks/hotkeys/handleKeyDown.ts
// TODO: 待各 store 逐一优雅化后，再收紧此处的依赖注入参数。

/** Dispatches a keyboard event to the matching global shortcut.
 *
 * 将键盘事件分发给匹配的全局快捷键。
 */
export function handleKeyDown(event: KeyboardEvent, deps: ShortcutDeps) {
  // 输入过滤：焦点在输入框内时不响应快捷键
  const target = event.target as HTMLElement;
  const isInput =
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.isContentEditable;
  if (isInput) return;

  // 跨平台主键：Mac 用 Meta（⌘），其余平台用 Ctrl
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const mainKey = isMac ? event.metaKey : event.ctrlKey;
  const shiftKey = event.shiftKey;
  const key = event.key.toLowerCase();

  // ESC：优先关闭已打开的设置面板
  if (key === "escape" && deps.isSettingsOpen) {
    event.preventDefault();
    event.stopPropagation();
    deps.closeSettings();
    return;
  }

  // [Cmd/Ctrl] + [,]：开关设置面板（业界惯例，同 VS Code）
  if (mainKey && key === ",") {
    event.preventDefault();
    if (deps.isSettingsOpen) {
      deps.closeSettings();
    } else {
      deps.openSettings();
    }
    return;
  }

  // [Cmd/Ctrl] + B：收放侧边栏
  if (mainKey && !shiftKey && key === "b") {
    event.preventDefault();
    deps.toggle();
  }

  // [Cmd/Ctrl] + E：切换侧边栏左右位置
  if (mainKey && !shiftKey && key === "e") {
    event.preventDefault();
    deps.toggleSide();
  }
}

/** Actions and state consumed by the global shortcut handler.
 *
 * 全局快捷键处理器依赖的动作与状态。
 */
interface ShortcutDeps {
  isSettingsOpen: boolean;
  closeSettings: () => void;
  openSettings: () => void;
  toggle: () => void;
  toggleSide: () => void;
}
