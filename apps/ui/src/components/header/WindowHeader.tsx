// apps/ui/src/components/header/WindowHeader.tsx
import { props } from "@stylexjs/stylex";
import { getCurrentWindow } from "@tauri-apps/api/window";
import type { MouseEvent } from "react";

import { isMac, isTahoeOrNewer, isWindows } from "@/lib";
import { useWindowState } from "@/hooks";
import { windowHeaderStyles } from "@/styles";
import { Breadcrumb } from "./Breadcrumb";
import { SettingsButton } from "./SettingsButton";
import { SidebarToggle } from "./SidebarToggle";
import { SideSwitch } from "./SideSwitch";
import { WindowsWindowControls } from "./WindowsWindowControls";

/** Window header of the application.
 *
 * 应用的窗口顶栏。
 */
export function WindowHeader() {
  const { isMaximized, isFullscreen } = useWindowState();

  const handleDoubleClick = () => {
    getCurrentWindow().toggleMaximize();
  };

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && event.button === 0 && event.detail === 1) {
      getCurrentWindow().startDragging();
    }
  };

  return (
    <header
      {...props(
        windowHeaderStyles.root,
        isMac && [
          !isTahoeOrNewer && windowHeaderStyles.preTahoeHeight,
          !isFullscreen && windowHeaderStyles.trafficLightInset,
        ]
      )}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
    >
      <div {...props(windowHeaderStyles.breadcrumbWrap)}>
        <Breadcrumb />
      </div>

      <div {...props(windowHeaderStyles.controls, isWindows && windowHeaderStyles.controlsWindows)}>
        <SideSwitch />
        <SidebarToggle />
        <SettingsButton />
      </div>

      {isWindows && <WindowsWindowControls isMaximized={isMaximized} />}
    </header>
  );
}
