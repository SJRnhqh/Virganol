import { useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { NAV_ITEMS } from "@/config/navigation";

// 引入拆分后的组件和 Hook
import { Breadcrumb } from "./Breadcrumb";
import { SettingsButton } from "./SettingsButton";
import { useWindowState } from "@/hooks/useWindowState";
import { MacTrafficLightSpacer } from "./MacTrafficLightSpacer";
import { WindowsWindowControls } from "./WindowsWindowControls";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  const [osType] = useState(() => type());
  const isWindows = osType === "windows";
  const isMac = osType === "macos";

  // 1. 逻辑下沉到 Hook
  const { isMaximized, isFullscreen } = useWindowState();

  const currentItem = useMemo(
    () => NAV_ITEMS.find((i) => i.id === activeId),
    [activeId],
  );

  return (
    <header
      className="relative h-10 flex items-end border-b border-sidebar-border bg-header-bg shrink-0 select-none cursor-default px-4 sm:px-6"
      onMouseDown={(e) =>
        e.button === 0 && e.detail === 1 && getCurrentWindow().startDragging()
      }
      onDoubleClick={() => getCurrentWindow().toggleMaximize()}
    >
      {/* 2. Mac 物理占位符 */}
      {isMac && <MacTrafficLightSpacer isFullscreen={isFullscreen} />}

      {/* 3. 面包屑区域 */}
      <div className="h-full z-10">
        <Breadcrumb label={currentItem?.label} />
      </div>

      {/* 4. 右侧功能区 */}
      <div
        className={`flex items-center h-full ml-auto mb-0.5 ${isWindows ? "mr-24" : "mr-1"}`}
      >
        <SettingsButton onClick={() => console.log("Open Settings")} />
      </div>

      {/* 5. Windows 控制按钮 */}
      {isWindows && <WindowsWindowControls isMaximized={isMaximized} />}
    </header>
  );
}
