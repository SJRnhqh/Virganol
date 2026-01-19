/* src/components/base/BaseCanvas.tsx */
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  type ReactFlowProps,
} from "@xyflow/react";
/* 引入 React Flow 基础样式，后续会被我们的 canvas.css 覆盖 */
import "@xyflow/react/dist/style.css";

/**
 * V.I.N.E. BaseCanvas - 基础设施级画布底座
 * 此时已完成“逻辑与样式”的分离。
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
    <div className="w-full h-full bg-main-bg transition-colors duration-500">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        minZoom={0.4}
        maxZoom={2.0}
        /* 基础动画配置，具体视觉参数(颜色、粗细)已迁移至 canvas.css */
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
        proOptions={{ hideAttribution: true }}
        className="touch-none"
        {...rest}
      >
        {/* 🌟 极致精简：不再传递 color, size 或 className，样式完全由 CSS 掌控 */}
        <Background variant={BackgroundVariant.Dots} gap={24} />

        {/* 控制器组件：边距和影子通过 Tailwind 处理，内部色彩由 CSS 处理 */}
        <Controls
          showInteractive={false}
          className="m-4! border-none! shadow-none!"
        />

        {children}
      </ReactFlow>
    </div>
  );
}
