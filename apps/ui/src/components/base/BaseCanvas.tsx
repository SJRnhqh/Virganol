import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  SelectionMode,
  type ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// --- 1. 配置常量 (基础设施配置) ---

/** 交互配置：定义如何拖拽、选择和缩放 */
const INTERACTION_CONFIG = {
  // 平时仅允许中键 [1] 拖拽
  panOnDrag: [1],
  // 🌟 核心：按下 Space 键时激活“抓手模式”（自动允许左键拖拽）
  panActivationKeyCode: "Space",
  // 允许拖拽框选
  selectionOnDrag: true,
  selectionMode: SelectionMode.Partial,
  // 允许滚动缩放
  zoomOnScroll: true,
  // 连线平滑
  defaultEdgeOptions: {
    type: "smoothstep",
    animated: true,
  },
};

/** 视图配置：定义缩放限制和网格 */
const VIEWPORT_CONFIG = {
  fitView: true,
  minZoom: 0.6,
  maxZoom: 1,
  snapToGrid: true,
  snapGrid: [24, 24] as [number, number],
};

/** UI 配置：隐藏水印等 */
const UI_CONFIG = {
  proOptions: { hideAttribution: true },
  className: "touch-none", // 禁用浏览器默认触摸逻辑
};

/**
 * V.I.N.E. BaseCanvas - 基础设施级画布底座
 * * 重构说明：
 * 1. 移除了手动的 window keydown 监听，改用 React Flow 原生 panActivationKeyCode。
 * 2. 将配置项抽取为常量，保持 JSX 干净。
 * 3. 简化 Props 传递，支持所有 ReactFlowProps 透传。
 */
export function BaseCanvas(props: ReactFlowProps) {
  // 分离 children，其余的全部作为 props 透传给 ReactFlow
  const { children, className, ...rest } = props;

  return (
    <div className={`w-full h-full bg-main-bg ${className || ""}`}>
      <ReactFlow
        // 展开配置常量
        {...INTERACTION_CONFIG}
        {...VIEWPORT_CONFIG}
        {...UI_CONFIG}
        // 展开传入的业务 Props (nodes, edges, onNodesChange 等)
        {...rest}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} />

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