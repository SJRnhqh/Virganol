import { useMemo, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type } from "@tauri-apps/plugin-os";
import { NAV_ITEMS } from "@/config/navigation";

// ✅ 引入你已经拆分好的组件和 Hook
import { Breadcrumb } from "./Breadcrumb";
import { SettingsButton } from "./SettingsButton";
// 🟢 新增：引入侧边栏切换组件
import { SidebarToggle } from "./SidebarToggle"; 
import { MacTrafficLightSpacer } from "./MacTrafficLightSpacer";
import { WindowsWindowControls } from "./WindowsWindowControls";
import { useWindowState } from "@/hooks/useWindowState";

interface WindowHeaderProps {
  activeId: string;
}

export function WindowHeader({ activeId }: WindowHeaderProps) {
  // 🟢 修复：根据 TS 报错，type() 是同步的，直接在 useState 初始化即可
  const [osType] = useState(() => {
    try {
      return type(); // 同步调用
    } catch (error) {
      console.warn("OS detection failed", error);
      return null;
    }
  });

  const isWindows = osType === "windows";
  const isMac = osType === "macos";

  // 窗口状态 Hook
  const { isMaximized, isFullscreen } = useWindowState();

  // 导航项查找
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
        className={`flex items-center h-full ml-auto mb-0.5 ${isWindows ? "mr-26" : "mr-1"}`}
      >
        {/* 🟢 布局控制组：将切换按钮放在设置按钮左侧，保持 1 单位间隔 */}
        <div className="flex items-center gap-1">
          <SidebarToggle />
          <SettingsButton onClick={() => console.log("Open Settings")} />
        </div>
      </div>

      {/* 5. Windows 控制按钮 */}
      {isWindows && <WindowsWindowControls isMaximized={isMaximized} />}
    </header>
  );
}