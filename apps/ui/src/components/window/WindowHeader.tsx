import { memo, useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { type as getOsType } from "@tauri-apps/plugin-os";
import { Minus, Square, X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowControlBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  isClose?: boolean;
}

export const WindowHeader = memo(() => {
  const [isMaximized, setIsMaximized] = useState(false);
  const appWindow = getCurrentWindow();
  const [osType] = useState(() => getOsType());
  const isMac = osType === "macos";

  useEffect(() => {
    const updateState = async () =>
      setIsMaximized(await appWindow.isMaximized());
    updateState();
    const unlisten = appWindow.onResized(updateState);
    return () => {
      unlisten.then((f) => f());
    };
  }, [appWindow]);

  // 如果是 Mac，且不需要显示任何标题，可以直接返回 null (或者保留一个空的 div 占位)
  // 但为了布局的统一性，保留一个空的容器也是可以的
  if (isMac) {
    // 方案 A: Mac 完全隐藏右侧顶栏 (让 Canvas 冲顶)
    // return null;

    // 方案 B: Mac 保留一个空的透明占位 (防止内容贴顶太紧)
    return <div className="h-4 w-full bg-transparent pointer-events-none" />;
  }

  return (
    <header
      data-tauri-drag-region
      className={cn(
        // 这里用了 justify-end，把所有东西推到最右边
        "flex items-center justify-end shrink-0",
        "h-10 w-full px-4",
        "bg-[#FAF7F0] text-[#2F3E46]",
        "z-40", // 确保层级
      )}
    >
      {/* ❌ 删除了之前的 左侧面包屑 (Cpu图标 + Project/Default Space) */}

      {/* === 只保留：Windows 窗口控制 === */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <WinBtn onClick={() => appWindow.minimize()}>
          <Minus size={14} />
        </WinBtn>
        <WinBtn
          onClick={async () => {
            await appWindow.toggleMaximize();
            setIsMaximized(await appWindow.isMaximized());
          }}
        >
          {isMaximized ? <Maximize2 size={12} /> : <Square size={12} />}
        </WinBtn>
        <WinBtn onClick={() => appWindow.close()} isClose>
          <X size={14} />
        </WinBtn>
      </div>
    </header>
  );
});

const WinBtn = ({ children, onClick, isClose }: WindowControlBtnProps) => (
  <button
    onClick={onClick}
    className={cn(
      "h-7 w-7 rounded-md flex items-center justify-center transition-all duration-200",
      isClose
        ? "hover:bg-rose-500 hover:text-white"
        : "hover:bg-black/5 text-[#2F3E46]/80 hover:text-black",
    )}
  >
    {children}
  </button>
);
