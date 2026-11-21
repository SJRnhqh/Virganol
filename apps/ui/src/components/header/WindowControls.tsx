// apps/ui/src/components/header/WindowControls.tsx
import { props } from "@stylexjs/stylex";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import type { JSX, MouseEvent } from "react";

import type { WindowControlsProps } from "@/types";
import { windowControlsStyles } from "@/styles";

/** Window controls of the application.
 *
 * 应用的窗口控制按钮组。
 */
export function WindowControls({ isMaximized }: WindowControlsProps): JSX.Element {
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleMinimize = () => getCurrentWindow().minimize();

  const handleToggleMaximize = () => getCurrentWindow().toggleMaximize();

  const handleClose = () => getCurrentWindow().close();

  return (
    <div {...props(windowControlsStyles.root)} onMouseDown={handleMouseDown}>
      <button
        {...props(windowControlsStyles.button, windowControlsStyles.minimizeButton)}
        onClick={handleMinimize}
      >
        <Minus size={14} strokeWidth={3} />
      </button>

      <button
        {...props(windowControlsStyles.button, windowControlsStyles.maximizeButton)}
        onClick={handleToggleMaximize}
      >
        {isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
      </button>

      <button
        {...props(windowControlsStyles.button, windowControlsStyles.closeButton)}
        onClick={handleClose}
      >
        <X size={14} />
      </button>
    </div>
  );
}
