/* src/components/base/BaseCanvas.tsx */
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
  return (
    /* 使用 MainLayout 定义的背景色，保持视觉统一 */
    <div className="w-full h-full bg-main-bg">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        // --- 核心“丝滑”配置 ---
        fitView // 初始自动调整视角，让所有节点可见
        snapToGrid={true} // 🌟 开启吸附，让拖拽具有工业级的精准感
        snapGrid={[24, 24]} // 吸附步长，与背景点阵间距保持一致
        minZoom={1} // 允许缩得更小，方便查看宏观拓扑
        maxZoom={2} // 限制最大放大倍数，防止像素崩坏
        // --- 🌟 专业级交互约束 ---
        // 1. 禁用左键直接拖拽画布，改为只有中键(1)和右键(2)可以拖拽
        panOnDrag={[1, 2]}
        // 2. 启用左键框选功能
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        // 3. 启用空格键激活“抓手”模式进行移动
        panActivationKeyCode="Space"
        // 4. 允许通过缩放滚轮在移动时更顺滑
        zoomOnScroll={true}
        // --- 连线基础行为 ---
        defaultEdgeOptions={{
          type: "smoothstep", // 经典的折线风格，整洁直观
          animated: true, // 默认开启连线动画，表现数据流向
        }}
        // --- 移除多余装饰 ---
        proOptions={{ hideAttribution: true }} // 隐藏右下角 Logo
        className="touch-none" // 禁用浏览器默认触摸逻辑，防止交互干扰
        {...rest}
      >
        {/* 背景网格：作为位置参考，保持最基本的点阵模式 */}
        <Background variant={BackgroundVariant.Dots} gap={24} />

        {/* 控制按钮：放在右上角，避开底部 Dock 栏 */}
        <Controls
          position="top-right"
          showInteractive={false}
          className="m-6 border-none! bg-transparent! shadow-none!"
        />

        {/* 预留插槽：用于渲染自定义 UI 覆盖层 */}
        {children}
      </ReactFlow>
    </div>
  );
}
