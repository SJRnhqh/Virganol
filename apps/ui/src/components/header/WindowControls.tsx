// apps/ui/src/components/header/WindowControls.tsx
import { props } from "@stylexjs/stylex";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { JSX } from "react";

import type { WindowControlsProps } from "@/types";
import { headerSharedStyles, windowControlsStyles } from "@/styles";
import { windowControlsIcons } from "@/icons";

/** Window controls of the application.
 *
 * 应用的窗口控制按钮组。
 */
export function WindowControls({ isMaximized }: WindowControlsProps): JSX.Element {
  const handleMinimize = () => getCurrentWindow().minimize();

  const handleToggleMaximize = () => getCurrentWindow().toggleMaximize();

  const handleClose = () => getCurrentWindow().close();

  return (
    <div {...props(headerSharedStyles.root, windowControlsStyles.root)}>
      <button
        {...props(windowControlsStyles.button, windowControlsStyles.minimizeButton)}
        onClick={handleMinimize}
      >
        {windowControlsIcons.minimize}
      </button>

      <button
        {...props(windowControlsStyles.button, windowControlsStyles.maximizeButton)}
        onClick={handleToggleMaximize}
      >
        {isMaximized ? windowControlsIcons.restore : windowControlsIcons.maximize}
      </button>

      <button
        {...props(windowControlsStyles.button, windowControlsStyles.closeButton)}
        onClick={handleClose}
      >
        {windowControlsIcons.close}
      </button>
    </div>
  );
}
