/* apps/ui/src/components/base/BaseCanvas.tsx */
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  SelectionMode,
  type ReactFlowProps,
} from "@xyflow/react";
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
  return (
    <div className="w-full h-full bg-main-bg">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        // --- 核心“丝滑”配置 ---
        fitView
        snapToGrid={true}
        snapGrid={[24, 24]}
        minZoom={0.2} // 建议允许缩得更小一点，方便查看超大拓扑
        maxZoom={2}
        // --- 🌟 专业级交互约束 ---
        // 1. 禁用左键(0)和右键(2)拖拽画布，仅保留中键(1)拖拽
        // 这样右键可以回归原本的“上下文菜单”功能
        panOnDrag={[1]}
        // 2. 启用左键框选功能
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        // 3. 启用空格键激活“抓手”模式进行移动 (设计师习惯)
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
        className="touch-none"
        {...rest}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} />

        <Controls
          position="top-right"
          showInteractive={false}
          className="m-6 border-none！ bg-transparent! shadow-none!"
        />

        {children}
      </ReactFlow>
    </div>
  );
}
