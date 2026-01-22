import { useState, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useWindowState() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const appWindow = getCurrentWindow();

    const updateState = async () => {
      // 并行获取状态，提高效率
      const [max, full] = await Promise.all([
        appWindow.isMaximized(),
        appWindow.isFullscreen(),
      ]);
      setIsMaximized(max);
      setIsFullscreen(full);
    };

    // 初始化
    updateState();

    // 监听窗口尺寸变化
    const unlistenPromise = appWindow.onResized(updateState);

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  return { isMaximized, isFullscreen };
}
