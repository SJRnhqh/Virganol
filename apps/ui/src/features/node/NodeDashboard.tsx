// src/features/node/NodeDashboard.tsx
import { NodeCanvas, NodeTerminalDock } from "./components";
import { useTerminalStore } from "@/store/TerminalStore";
import { clsx } from "clsx";

export const NodeDashboard = () => {
  // 我们需要 isOpen 来决定渲染，isMaximized 来决定位置
  const { isOpen, isMaximized } = useTerminalStore();
  return (
    /* 🌟 容器层：使用 isolate 开启独立的堆叠上下文 */
    <div className="relative w-full h-full overflow-hidden isolate bg-[#121212]">
      {/* 🟦 Layer 0: 画布层 */}
      <div className="absolute inset-0 z-0">
        <NodeCanvas />
      </div>

      {/* 🟧 Layer 1: 终端窗口层 */}
      {/* pointer-events-none: 关键！让这一层的透明区域允许鼠标穿透点击底下的 Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {isOpen && (
          <div
            className={clsx(
              // 公共样式：恢复鼠标交互、过渡动画、阴影
              "pointer-events-auto shadow-2xl transition-all duration-300 ease-out border border-white/10",

              // 🔀 状态切换逻辑
              isMaximized
                ? "absolute inset-0 z-50 rounded-none" // 最大化：铺满全屏，无圆角
                : clsx(
                    "absolute z-50 rounded-xl",
                    // 📐 黄金比例尺寸 (约 1.618)
                    // w-[900px] / h-[560px] ≈ 1.60
                    "w-225 h-140",

                    // 📍 位置：绝对垂直居中 + 靠右 10% (视觉上的中右侧)
                    "top-1/2 -translate-y-1/2 right-[10%]",
                  ),
            )}
          >
            <NodeTerminalDock />
          </div>
        )}
      </div>
    </div>
  );
};
