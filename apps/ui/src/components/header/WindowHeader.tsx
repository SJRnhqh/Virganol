// apps/ui/src/components/header/WindowHeader.tsx
import { props } from "@stylexjs/stylex";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { JSX, MouseEvent } from "react";

import { isMac, isTahoeOrNewer, isWindows } from "@/lib";
import { useWindowState } from "@/hooks";
import { headerSharedStyles, windowHeaderStyles } from "@/styles";
import { SettingsButton } from "./SettingsButton";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { SideSwitchButton } from "./SideSwitchButton";
import { WindowControls } from "./WindowControls";

/** Window header of the application.
 *
 * 应用的窗口顶栏。
 */
export function WindowHeader(): JSX.Element {
  const { isMaximized, isFullscreen } = useWindowState(); // TBD: Query window state per OS.

  const handleDoubleClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      getCurrentWindow().toggleMaximize();
    }
  };

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.button === 0 && event.detail === 1) {
      getCurrentWindow().startDragging();
    }
  };

  return (
    <header
      {...props(
        headerSharedStyles.root,
        windowHeaderStyles.root,
        isMac && [
          !isTahoeOrNewer && windowHeaderStyles.preTahoeHeight,
          !isFullscreen && windowHeaderStyles.trafficLightInset,
        ],
        isWindows && windowHeaderStyles.windowEdgeAlignment
      )}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <div {...props(windowHeaderStyles.actions)}>
        <SideSwitchButton />
        <SidebarToggleButton />
        <SettingsButton />
      </div>

      {isWindows && <WindowControls isMaximized={isMaximized} />}
    </header>
  );
}
