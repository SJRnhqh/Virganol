// apps/ui/src/components/workbench/WindowHeader/WindowHeader.tsx
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { useState } from "react";

import { useWindowState } from "@/hooks";
import { cn } from "@/lib";
import { Breadcrumb } from "./Breadcrumb";
import { MacTrafficLightSpacer } from "./MacTrafficLightSpacer";
import { SettingsButton } from "./SettingsButton";
import { SidebarToggle } from "./SidebarToggle";
import { SideSwitch } from "./SideSwitch";
import { WindowsWindowControls } from "./WindowsWindowControls";

export function WindowHeader() {
  const [osType] = useState(() => {
    try {
      return type();
    } catch {
      return null;
    }
  });

  const isWindows = osType === "windows";
  const isMac = osType === "macos";
  const { isMaximized, isFullscreen } = useWindowState();

  return (
    <header
      className={cn(
        "relative h-10 flex items-end border-b border-sidebar-border bg-header-bg shrink-0 select-none cursor-default px-4 sm:px-6",
        "z-9999 isolate" // 🚀 确保层级置顶
      )}
      onMouseDown={(e) => {
        // ✅ 修正逻辑：只有点在背景上且满足拖拽条件时才执行
        if (e.target === e.currentTarget) {
          if (e.button === 0 && e.detail === 1) {
            getCurrentWindow().startDragging();
          }
        }
      }}
      onDoubleClick={() => {
        getCurrentWindow().toggleMaximize();
      }}
    >
      {isMac && <MacTrafficLightSpacer isFullscreen={isFullscreen} />}

      <div className="h-full z-10">
        <Breadcrumb />
      </div>

      <div className={cn("flex items-center h-full ml-auto mb-0.5", isWindows ? "mr-26" : "mr-1")}>
        <div className="flex items-center gap-1">
          <SideSwitch />
          <SidebarToggle />
          <SettingsButton />
        </div>
      </div>

      {isWindows && <WindowsWindowControls isMaximized={isMaximized} />}
    </header>
  );
}
