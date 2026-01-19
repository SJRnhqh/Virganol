/* apps/ui/src/components/base/BaseCanvas.tsx */
import { useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  SelectionMode,
  type ReactFlowProps,
} from "@xyflow/react";
/* 核心样式是必须的，保证基础功能（如缩放、拖拽）不失效 */
import "@xyflow/react/dist/style.css";

/**
 * V.I.N.E. BaseCanvas - 基础设施级画布底座
 * 目标：功能完整、操作丝滑、代码纯净。
 */
export function BaseCanvas({
  nodes,
  nodeTypes,
  onNodesChange,
  onNodeDoubleClick,
  children,
  ...rest
}: ReactFlowProps) {
  // --- 1. 状态监听：追踪空格键是否被按下 ---
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 避免长按重复触发
      if (e.code === "Space" && !e.repeat) {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    // --- 2. 动态类名：当按下空格时，添加 space-panning-mode 以配合 CSS 实现点击穿透 ---
    <div
      className={`w-full h-full bg-main-bg ${isSpacePressed ? "space-panning-mode" : ""}`}
    >
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        // --- 核心“丝滑”配置 ---
        fitView
        snapToGrid={true}
        snapGrid={[24, 24]} // 24px 网格吸附
        minZoom={0.6}
        maxZoom={1}
        // --- 🌟 专业级交互约束 (核心修正) ---
        // 1. 动态拖拽键位：
        //    - 平时：仅允许中键 [1] 拖拽 (左键用于框选，右键用于菜单)
        //    - 空格按下时：允许左键 [0] 和中键 [1] 拖拽 (实现类似 Figma 的抓手模式)
        panOnDrag={isSpacePressed ? [0, 1] : [1]}
        // 2. 启用左键框选功能
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        // 3. 启用空格键激活逻辑 (React Flow 内部逻辑)
        panActivationKeyCode="Space"
        // 4. 允许通过缩放滚轮在移动时更顺滑
        zoomOnScroll={true}
        // --- 连线基础行为 ---
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
        // --- 移除多余装饰 ---
        proOptions={{ hideAttribution: true }}
        className="touch-none" // 禁用浏览器默认触摸逻辑
        {...rest}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} />

        {/* 控制器 */}
        <Controls
          position="top-right"
          showInteractive={false}
          className="m-6 border-none! bg-transparent! shadow-none!"
        />

        {children}
      </ReactFlow>
    </div>
  );
}
